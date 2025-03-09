import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/server/db/schema";
import { db } from "@/server/db/index";
import bcrypt from "bcrypt";
import { eq, isNull, and } from "drizzle-orm";
import { DefaultSession, NextAuthOptions } from "next-auth";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
            
                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email))
                    .get();
            
                if (!user) return null;
            
                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) return null;
            
                return { id: String(user.id), email: user.email, name: user.name }; // Convert id to string here
            }
            
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
