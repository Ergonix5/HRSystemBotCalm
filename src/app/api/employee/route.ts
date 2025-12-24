import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/db";

import { Employee } from "../../models/employee.model"; 
import { Role } from "../../models/role.model";         
import { Designation } from "../../models/designations.model";

import { validateBody } from "../../../lib/validate";
import { employeeCreateSchema } from "../../../validators/employee.schema";
import { paginate } from "../../service/pagination.service";
import { generateSecurePassword } from "../../utils/passwordGenerator";
import { sendEmail } from "../../service/email.service";
import { welcomeTemplate } from "../../constant/email.template";
/**
 * GET /api/Employee - Fetch paginated employees with search
 * Query params: organizationId, page, limit, q
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const organizationId = (searchParams.get("organizationId") ?? "").trim();
    if (!organizationId) {
      return NextResponse.json(
        { message: "organizationId is required" },
        { status: 400 }
      );
    }

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const q = (searchParams.get("q") ?? "").trim();

    //  If your paginate() supports extra filters, pass it.
    // If it doesn't, tell me your paginate service and I’ll adapt exactly.
    const result = await paginate(Employee, {
      page,
      limit,
      q,
      searchFields: ["first_name", "last_name", "email", "phone"],
      sortBy: "createdAt",
      sortOrder: -1,
      filter: { organization: organizationId }, //  org scoped
 // don’t return hash
    });

    // Populate and select fields for the data
    const populatedData = await Employee.find({ _id: { $in: result.data.map((emp: any) => emp._id) } })
      .select("-hash_password")
      .populate("organization")
      .populate("designation", "title designation_id")
      .populate("role", "role_name role_id permissions")
      .sort({ createdAt: -1 });

    result.data = populatedData;

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}





/**
 * POST /api/Employee - Create new employee
 * Body: { organization, designation, role, first_name, last_name, email, password, ... }
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const result = await validateBody(req, employeeCreateSchema);
    if (!result.ok) return result.res;

    const data = result.data;

    //  validate role belongs to organization
    const role = await Role.findOne({
      _id: data.role,
      organization: data.organization,
    });
    if (!role) {
      return NextResponse.json(
        { message: "Invalid role for this organization" },
        { status: 400 }
      );
    }

    //  validate designation exists (GLOBAL)
    const designation = await Designation.findById(data.designation);
    if (!designation) {
      return NextResponse.json(
        { message: "Invalid designation" },
        { status: 400 }
      );
    }

  
    //  generate secure password and hash it
    const generatedPassword = generateSecurePassword(12);
    const hash_password = await bcrypt.hash(generatedPassword, 10);

    const created = await Employee.create({
      organization: data.organization,
      designation: data.designation,
      role: data.role,

      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,

      hash_password,

      phone: data.phone,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
      join_date: data.join_date ? new Date(data.join_date) : undefined,
      employment_status: data.employment_status ?? "active",
      address: data.address,
    });

    const safe = await Employee.findById(created._id)
      .select("-hash_password")
      .populate("designation", "title designation_id")
      .populate("role", "role_name role_id");

    // Send welcome email with credentials
    try {
      const { to, subject, html } = welcomeTemplate(
        `${data.first_name} ${data.last_name}`,
        data.email,
        generatedPassword
      );
      await sendEmail({ to, subject, html });
      console.log("Welcome email sent to:", data.email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully and welcome email sent",
        data: safe,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Email already exists in this organization" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

