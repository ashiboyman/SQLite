"use server";

import { db } from "@/server/db/index";
import { pendingUsers, users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function verifyEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  try {
    // Find the pending user with matching email and code
    const pendingUser = await db.query.pendingUsers.findFirst({
      where: (pending, { eq, and }) => 
        and(eq(pending.email, email), eq(pending.verificationCode, code))
    });

    if (!pendingUser) {
      return { error: "Invalid verification code" };
    }

    // Check if code is expired
    if (new Date() > new Date(pendingUser.expiresAt)) {
      return { error: "Verification code expired" };
    }

    // Create the verified user
    await db.insert(users).values({
      email: pendingUser.email,
      password: pendingUser.password,
      name: pendingUser.name
    });

    // Delete the pending user
    await db.delete(pendingUsers).where(eq(pendingUsers.id, pendingUser.id));

    return { success: "Email verified successfully! You can now log in." };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred during verification." };
  }
}
