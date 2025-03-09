"use server";

import { users } from "@/server/db/schema";
import { db } from "@/server/db/index";
import bcrypt from "bcrypt";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
        return { error: "All fields are required." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.insert(users).values({ email, password: hashedPassword, name });

        // Return success message
        return { success: "User registered successfully!" };
    } catch (error) {
        console.error(error);
        return { error: "User already exists or database error." };
    }
}
