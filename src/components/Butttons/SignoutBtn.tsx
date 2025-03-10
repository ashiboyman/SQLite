"use client"
import { signOut } from "next-auth/react";

export default function SignOutBtn() {
    return (
        <>
            <button className="p-4 text-xl border border-red-400 text-red-400 rounded-2xl" onClick={() => signOut()}>Sign Out</button>
        </>
    );
}
