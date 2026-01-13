import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grievanceiq';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log('[MongoDB] ✅ Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('[MongoDB] 🔌 Attempting to connect to MongoDB...', {
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials in logs
      hasUri: !!MONGODB_URI,
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[MongoDB] ✅ Connected successfully!', {
        readyState: mongoose.connection.readyState,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      });
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('[MongoDB] ✅ Connection established', {
      readyState: cached.conn.connection.readyState,
      dbName: cached.conn.connection.name,
    });
  } catch (e: any) {
    cached.promise = null;
    console.error('[MongoDB] ❌ Connection failed:', {
      error: e.message,
      code: e.code,
      name: e.name,
      stack: e.stack,
    });
    throw e;
  }

  return cached.conn;
}

export default connectDB;

