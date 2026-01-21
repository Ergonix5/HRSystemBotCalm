import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/src/lib/db"; // your connectDB
import { Employee } from "@/src/app/models/employee.model";
import { signAccessToken, signRefreshToken } from "@/src/lib/jwt";
import { setAuthCookies } from "@/src/lib/auth-cookies";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    console.log("Login request started");
    console.log("Environment check:", {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ? 'Set' : 'Not set',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });
    
    await connectDB();
    console.log("DB connected");

    const body = await req.json();
    console.log("Request body parsed");
    const { email, password } = bodySchema.parse(body);
    console.log("Body validation passed");

    // password = h@SQSc85himQ

    const user = await Employee.findOne({ email }).select("+hash_password").lean();
    console.log("User query completed", user ? "User found" : "User not found");

    
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.hash_password);
    console.log("Password comparison completed", ok ? "Match" : "No match");
    
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

   const payload = { sub: String(user._id), orgId: String(user.organization), role: String(user.role) };


    console.log("Creating tokens...");

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);
    console.log("Cookies set, login successful");

    return NextResponse.json(
      { message: "Logged in", user: { id: String(user._id), email: user.email, role: user.role  } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Login error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Return a more specific error message for debugging
    const errorMessage = err.message || "Internal server error";
    return NextResponse.json({ 
      message: "Login failed", 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }, { status: 500 });
  }
}
