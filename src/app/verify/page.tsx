"use client";

import { useState, useEffect } from "react";
import { verifyEmail } from "@/server/verifAction";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  
  // If no email is in the URL, redirect to signup
 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    // At this point, TypeScript should know email is not null, but it might still
    // show an error because it can't track the null check across the entire function
    // We can use type assertion to tell TypeScript that email is a string
    formData.append("email", email as string);
    formData.append("code", verificationCode);
    
    const result = await verifyEmail(formData);
    
    setIsSubmitting(false);
    
    if (result.error) {
      setMessage({ type: "error", content: result.error });
    } else if (result.success) {
      setMessage({ type: "success", content: result.success });
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }
  const handleResendCode = () => {
    // You can implement the resend functionality here
    setMessage({ type: "info", content: "A new verification code has been sent to your email." });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center p-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-center">
          We've sent a 6-digit code to <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {message.content && (
          <Alert className={`${
            message.type === "error" 
              ? "bg-red-50 text-red-600 border-red-200" 
              : message.type === "success"
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="code">Verification Code</Label>
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-slate-500"
                type="button"
                onClick={handleResendCode}
              >
                Resend code
              </Button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                className="pl-10"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-slate-500">
          Having trouble? <Link href="/contact">
            <Button variant="link" className="p-0 h-auto text-sm">
              Contact Support
            </Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
  );
}
