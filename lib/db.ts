import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("⚠️ MONGODB_URI environment variable is not defined");
    throw new Error("Database configuration error: MONGODB_URI is required. Please set it in your deployment environment variables.");
}

if (MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost')) {
    console.warn("⚠️ Warning: Using localhost MongoDB connection. This will fail in production.");
}

/* Global cache to prevent multiple connections in dev mode */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
