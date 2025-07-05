import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/server/db/schema";
import { db } from "@/server/db/index";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import { ZodError } from "zod"
import { signInSchema } from "@/lib/zod"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // Basic check to ensure values exist
                    if (!credentials?.email || !credentials?.password) {
                      throw new Error("All fields are required.");
                    }
          
                    // Validate credentials using Zod
                    const { email, password } = await signInSchema.parseAsync(
                      credentials
                    );
          
                    // Retrieve the user from your database
                    const user = await db
                      .select()
                      .from(users)
                      .where(eq(users.email, email))
                      .get();
          
                    if (!user) {
                      throw new Error("Username or password is not valid");
                    }
          
                    // Compare passwords (assuming you are using bcrypt)
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (!isValidPassword) {
                      throw new Error("Username or password is not valid");
                    }
          
                    // Return the user object if everything is valid
                    return { id: String(user.id), email: user.email, name: user.name };
                  } catch (error) {
                    // If the error comes from Zod, format the errors
                    if (error instanceof ZodError) {
                      const formattedErrors = error.issues
                        .map((issue) => issue.message)
                        .join(", ");
                      throw new Error(formattedErrors);
                    }
                    // For any other error, re-throw it
                    throw error;
                  }
                // if (!credentials?.email || !credentials?.password) {
                //     throw new Error("All fields are required.");
                // }
                // const { email, password } = await signInSchema.parseAsync(credentials)


                // const user = await db
                //     .select()
                //     .from(users)
                //     .where(eq(users.email, credentials.email))
                //     .get();

                // if (!user) {
                //     throw new Error("User Name or password is not valid");
                // }

                // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                // if (!isValidPassword) {
                //     throw new Error("User Name or password is not valid");
                // }

                // return { id: String(user.id), email: user.email, name: user.name };
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // Ensure the user ID from JWT is correctly attached to the session
            if (session.user) {
                // `token.id` is set in the `jwt` callback below. Fallback to `token.sub` for extra safety.
                session.user.id = (token as any).id ?? token.sub ?? undefined;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // ✅ Store user ID in token
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
