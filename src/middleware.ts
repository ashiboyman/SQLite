import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    console.log("🔥 Middleware is running...");

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);
    console.log(req.nextUrl.pathname);

    // Prevent infinite loop
    if (!token && (req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/signup")) {
        console.log("⛔ No session found, redirecting to login...");
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && req.nextUrl.pathname === "/signup") {
        console.log("⛔ already loged in");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (token && req.nextUrl.pathname === "/login") {
        console.log("⛔ already loged in");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

// Ensure middleware runs only for these routes
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*","/login:path*","/signup:path*"], // Adjust as needed
};
