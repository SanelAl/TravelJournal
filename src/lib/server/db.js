import { DB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const DB_NAME = 'TravelJournal';
const TRAVELS_COLLECTION = 'Travels';
const USERS_COLLECTION = 'Users';
const SESSIONS_COLLECTION = 'Sessions';

if (!DB_URI) {
	throw new Error('Missing DB_URI environment variable.');
}

let clientPromise;

function getClient() {
	if (!clientPromise) {
		const client = new MongoClient(DB_URI);
		clientPromise = client.connect();
	}

	return clientPromise;
}

export async function getDb() {
	const client = await getClient();
	return client.db(DB_NAME);
}

export async function getTravelsCollection() {
	const db = await getDb();
	return db.collection(TRAVELS_COLLECTION);
}

export async function getUsersCollection() {
	const db = await getDb();
	return db.collection(USERS_COLLECTION);
}

export async function getSessionsCollection() {
	const db = await getDb();
	return db.collection(SESSIONS_COLLECTION);
}

export { DB_NAME, SESSIONS_COLLECTION, TRAVELS_COLLECTION, USERS_COLLECTION };
