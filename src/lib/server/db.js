import { DB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const DB_NAME = 'TravelJournal';
const TRAVELS_COLLECTION = 'Travels';

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

export { DB_NAME, TRAVELS_COLLECTION };
