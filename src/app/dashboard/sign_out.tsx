"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
    LogOut,
} from "lucide-react";

export default function SignOut() {
    return (
        <>
            <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => signOut()}
            >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </Button>
        </>
    );
}
