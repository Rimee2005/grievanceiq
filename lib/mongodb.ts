import mongoose from 'mongoose';

// Debug: Log environment variable status
const envMongoDBUri = process.env.MONGODB_URI;
console.log('[MongoDB Config] Environment check:', {
  hasEnvVar: !!envMongoDBUri,
  envVarLength: envMongoDBUri?.length || 0,
  startsWithMongo: envMongoDBUri?.startsWith('mongodb') || false,
  // Don't log the full URI for security, just first few chars
  uriPreview: envMongoDBUri ? `${envMongoDBUri.substring(0, 20)}...` : 'NOT SET',
});

const MONGODB_URI = envMongoDBUri || 'mongodb://localhost:27017/grievanceiq';

if (!envMongoDBUri) {
  console.warn('[MongoDB Config] ⚠️ MONGODB_URI not found in environment variables!');
  console.warn('[MongoDB Config] Using fallback: mongodb://localhost:27017/grievanceiq');
  console.warn('[MongoDB Config] To fix: Ensure .env.local contains MONGODB_URI and restart the dev server');
}

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
        dbName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        connectionString: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
      });
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('[MongoDB] ✅ Connection established', {
      readyState: cached.conn.connection.readyState,
      dbName: cached.conn.connection.name,
      host: cached.conn.connection.host,
      port: cached.conn.connection.port,
      collections: Object.keys(cached.conn.connection.collections),
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

