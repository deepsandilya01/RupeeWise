import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;
let connectionError = null;

export const connectDatabase = async () => {
  if (!config.MONGODB_URI) {
    connectionError = 'MONGODB_URI is not configured in server environment';
    console.warn('[Database] MONGODB_URI is not set. Persistent database operations will be disabled.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      isConnected = true;
      connectionError = null;
      console.log('[Database] MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      isConnected = false;
      connectionError = err.message;
      console.error('[Database] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[Database] MongoDB disconnected.');
    });

    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = mongoose.connection.readyState === 1;

    // Migrate/sync googleId index if legacy non-sparse unique index exists
    if (isConnected) {
      try {
        const usersCollection = mongoose.connection.collection('users');
        const indexes = await usersCollection.indexes();
        const googleIdIndex = indexes.find((idx) => idx.name === 'googleId_1');
        if (googleIdIndex && !googleIdIndex.sparse && !googleIdIndex.partialFilterExpression) {
          await usersCollection.dropIndex('googleId_1');
          console.log('[Database] Dropped legacy non-sparse googleId_1 index.');
        }
      } catch {
        // Ignored if collection or index doesn't exist
      }
    }

    return isConnected;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error('[Database] Failed to connect to MongoDB:', error.message);
    return false;
  }
};

export const getDatabaseStatus = () => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    configured: Boolean(config.MONGODB_URI),
    connected: readyState === 1,
    state: states[readyState] || 'unknown',
    error: connectionError ? connectionError : null,
  };
};

export const isDatabaseReady = () => {
  return mongoose.connection.readyState === 1;
};

export default {
  connectDatabase,
  getDatabaseStatus,
  isDatabaseReady,
};
