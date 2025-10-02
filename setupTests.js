//setupTests.js

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    let connected = false;
    while (!connected) {
        try {
            await mongoose.connect(uri, {
                autoIndex: true,
                serverSelectionTimeoutMS: 20000,
            });
            connected = true;
        } catch (err) {
            await new Promise((res) => setTimeout(res, 100));
        }
    }
});


afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        console.warn("Mongoose not connected. Skipping dropDatabase/close.");
        return;
    }

    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    } catch (err) {
        console.error("Error stopping MongoMemoryServer:", err);
    }
});

