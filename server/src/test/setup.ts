// Iinital and final setup for tests

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll } from "vitest";
import { dbconnect } from "../config/db";

let mongoServer: MongoMemoryServer;
let originalDbUrl: string;

beforeAll(async () => {
  originalDbUrl = process.env.DATABASE_URL || "";
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = mongoUri;
  await dbconnect();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  process.env.DATABASE_URL = originalDbUrl;
});

afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});
