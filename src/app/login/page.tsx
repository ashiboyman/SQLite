"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const res = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/dashboard"); // Redirect after login
        }
    };

    return (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center align-middle">
            {/* <h2>Sign In</h2> */}
            {error && <p>{error}</p>}
            <form className="flex flex-col gap-4 p-4 shadow border-2 rounded-2xl" onSubmit={handleSubmit}>
                <input
                    className="p-4 rounded-2xl border"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />
                <input
                    className="p-4 rounded-2xl border"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />
                <button className="p-4 rounded-2xl border" type="submit">Sign In</button>
            </form>
        </div>
    );
}
