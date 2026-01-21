import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Test basic collection access without importing models
    const collections = await mongoose.connection.db?.listCollections().toArray();
    const collectionNames = collections?.map(c => c.name) || [];

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      connectionState: states[connectionState as keyof typeof states],
      database: mongoose.connection.db?.databaseName,
      collections: collectionNames,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}