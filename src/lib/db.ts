import mongoose from 'mongoose';
import { application } from '@/src/app/config/application';

const MONGODB_URI = application.MONGODB_URI;

if (!MONGODB_URI)
{
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}


let cached = (global as any).mongoose;

if (!cached)
{
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB()
{
    if (cached.conn)
    {
        return cached.conn;
    }

    if (!cached.promise)
    {
        console.log('Attempting to connect to MongoDB:', MONGODB_URI ? 'URI provided' : 'URI missing');
        
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then(mongoose => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch(err => {
            console.error('MongoDB connection error:', err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}