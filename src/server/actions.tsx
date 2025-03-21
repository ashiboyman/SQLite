"use server";

import { users } from "@/server/db/schema";
import { db } from "@/server/db/index";
import bcrypt from "bcrypt";
import { z } from "zod";

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
      // Join all error messages into a single string
      const validationErrors = error.errors
        .map((err) => err.message)
        .join(", ");
      return { error: validationErrors };
    }
    return { error: "Validation failed" };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    await db.insert(users).values({ email, password: hashedPassword, name });
    return { success: "User registered successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "User already exists or database error." };
  }
}
