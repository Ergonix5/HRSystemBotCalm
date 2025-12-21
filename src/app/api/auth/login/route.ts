import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/src/lib/db"; // your connectDB
import { Employee } from "../../../models/employee.model";
import { signAccessToken, signRefreshToken } from "@/src/lib/jwt";
import { setAuthCookies } from "../../../../lib/auth-cookies";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = bodySchema.parse(body);

    

    const user = await Employee.findOne({ email }).select("+hash_password").lean();

    
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.hash_password);
    
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const payload = { sub: String(user._id), role: user.role ,organization_id: user.organization ,designation: user.designation  };

    

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      { message: "Logged in", user: { id: String(user._id), email: user.email, role: user.role  } },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message ?? "Error" }, { status: 400 });
  }
}
