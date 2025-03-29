"use server";

import { pendingUsers, expenses } from "@/server/db/schema";
import { db } from "@/server/db/index";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Resend } from "resend";
import { PlaidVerifyIdentityEmail } from "@/components/Email/email-template";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the signup schema with Zod
const signupSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
      "Password must include at least one number and one symbol"
    ),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
});

// Function to generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signup(formData: FormData) {
  // Retrieve fields from the form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Validate the input with the schema
  try {
    signupSchema.parse({ email, password, name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors
        .map((err) => err.message)
        .join(", ");
      return { error: validationErrors };
    }
    return { error: "Validation failed" };
  }

  try {
    // Check if email already exists in users table
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });
    
    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Set expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Delete any existing pending registration for this email
    await db.delete(pendingUsers).where(eq(pendingUsers.email, email));
    
    // Store pending user with verification code
    await db.insert(pendingUsers).values({ 
      email, 
      password: hashedPassword, 
      name,
      verificationCode,
      expiresAt
    });
    
    // Send verification email
    const { data, error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // Update with your sender
      to: [email],
      subject: "Verify Your Email Address",
      react: PlaidVerifyIdentityEmail({ validationCode: verificationCode }),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { error: "Failed to send verification email. Please try again." };
    }

    return { 
      success: "Verification email sent! Please check your inbox.",
      email // Return email to redirect to verification page
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred during registration." };
  }
}


export async function createExpenseAction(data: {
  userId: number;
  amount: number;
  description: string;
  expenseDate?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Insert a new expense record. If expenseDate is not provided, default to current time.
    await db.insert(expenses).values({
      userId: data.userId,
      amount: data.amount,
      description: data.description,
      expenseDate: data.expenseDate || new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, error: "Failed to create expense." };
  }
}