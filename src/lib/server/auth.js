import { dev } from '$app/environment';
import { getSessionsCollection, getTravelsCollection, getUsersCollection } from '$lib/server/db.js';
import { ObjectId } from 'mongodb';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = 'tj_session';
const SESSION_DAYS = 30;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
const ADMIN_EMAIL = 'admin';
const ADMIN_PASSWORD = 'sudo';

export function normalizeEmail(email) {
	return String(email ?? '').trim().toLowerCase();
}

function cookieOptions() {
	return {
		httpOnly: true,
		maxAge: SESSION_MAX_AGE,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	};
}

function expiredCookieOptions() {
	return {
		httpOnly: true,
		maxAge: 0,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	};
}

async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
	const hash = await scrypt(String(password), salt, 64);

	return {
		passwordHash: Buffer.from(hash).toString('hex'),
		passwordSalt: salt
	};
}

async function verifyPassword(password, user) {
	if (!user?.passwordHash || !user?.passwordSalt) {
		return false;
	}

	const hash = await scrypt(String(password), user.passwordSalt, 64);
	const storedHash = Buffer.from(user.passwordHash, 'hex');

	if (storedHash.length !== hash.length) {
		return false;
	}

	return timingSafeEqual(storedHash, hash);
}

function hashToken(token) {
	return createHash('sha256').update(token).digest('hex');
}

function publicUser(user) {
	if (!user) {
		return null;
	}

	return {
		id: user._id.toString(),
		objectId: user._id,
		email: user.email,
		displayName: user.displayName,
		role: user.role || 'user',
		followingUserIds: (user.followingUserIds ?? []).map((id) => (id instanceof ObjectId ? id : new ObjectId(id)))
	};
}

export async function ensureAuthIndexes() {
	const users = await getUsersCollection();
	const sessions = await getSessionsCollection();

	await Promise.all([
		users.createIndex({ emailNormalized: 1 }, { unique: true }),
		sessions.createIndex({ tokenHash: 1 }, { unique: true }),
		sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
	]);
}

export async function ensureAdminUser() {
	await ensureAuthIndexes();

	const users = await getUsersCollection();
	const existing = await users.findOne({ emailNormalized: ADMIN_EMAIL });

	if (existing) {
		return existing;
	}

	const now = new Date();
	const password = await hashPassword(ADMIN_PASSWORD);
	const result = await users.insertOne({
		email: ADMIN_EMAIL,
		emailNormalized: ADMIN_EMAIL,
		displayName: 'Admin',
		role: 'admin',
		followingUserIds: [],
		...password,
		createdAt: now,
		updatedAt: now
	});

	return users.findOne({ _id: result.insertedId });
}

export async function assignOrphanTravelsToAdmin(adminUser) {
	const travels = await getTravelsCollection();
	await travels.updateMany(
		{ userId: { $exists: false } },
		{
			$set: {
				userId: adminUser._id,
				updatedAt: new Date()
			}
		}
	);
}

export async function registerUser({ email, displayName, password }) {
	await ensureAuthIndexes();

	const emailNormalized = normalizeEmail(email);
	const users = await getUsersCollection();
	const now = new Date();
	const passwordValues = await hashPassword(password);

	const result = await users.insertOne({
		email: String(email).trim(),
		emailNormalized,
		displayName: String(displayName).trim(),
		role: 'user',
		followingUserIds: [],
		...passwordValues,
		createdAt: now,
		updatedAt: now
	});

	return users.findOne({ _id: result.insertedId });
}

export async function authenticateUser(email, password) {
	const emailNormalized = normalizeEmail(email);

	if (emailNormalized === ADMIN_EMAIL) {
		if (password !== ADMIN_PASSWORD) {
			return null;
		}

		const admin = await ensureAdminUser();
		await assignOrphanTravelsToAdmin(admin);
		return admin;
	}

	const users = await getUsersCollection();
	const user = await users.findOne({ emailNormalized });

	if (!user || !(await verifyPassword(password, user))) {
		return null;
	}

	return user;
}

export async function createSession(cookies, user) {
	await ensureAuthIndexes();

	const token = randomBytes(32).toString('base64url');
	const tokenHash = hashToken(token);
	const now = new Date();
	const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);
	const sessions = await getSessionsCollection();

	await sessions.insertOne({
		userId: user._id,
		tokenHash,
		createdAt: now,
		expiresAt
	});

	cookies.set(SESSION_COOKIE, token, cookieOptions());
}

export async function getUserFromSession(cookies) {
	const token = cookies.get(SESSION_COOKIE);

	if (!token) {
		return null;
	}

	const sessions = await getSessionsCollection();
	const session = await sessions.findOne({
		tokenHash: hashToken(token),
		expiresAt: { $gt: new Date() }
	});

	if (!session?.userId) {
		return null;
	}

	const users = await getUsersCollection();
	const userId = session.userId instanceof ObjectId ? session.userId : new ObjectId(session.userId);
	const user = await users.findOne({ _id: userId });

	return publicUser(user);
}

export async function clearSession(cookies) {
	const token = cookies.get(SESSION_COOKIE);

	if (token) {
		const sessions = await getSessionsCollection();
		await sessions.deleteOne({ tokenHash: hashToken(token) });
	}

	cookies.delete(SESSION_COOKIE, expiredCookieOptions());
}
