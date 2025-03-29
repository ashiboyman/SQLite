"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  Settings,
  Bell,
  PieChart,
  Calendar,
  Mail,
  Menu,
  Banknote,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import SignOut from "./sign_out";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Define navigation items
  const navItems = [
    { icon: Home, label: "Home", slug: "dashboard" },
    { icon: Banknote, label: "Expenses", slug: "expenses" },
  ];
  
  // Simplified mobile navigation
  const mobileNavItems = [
    { icon: Home, label: "Home", slug: "dashboard" },
    { icon: Banknote, label: "Expenses", slug: "expenses" },
  ];

  // Function to check if a navigation item is active
  const isActive = (itemSlug: string) => {
    if (!itemSlug) return false;
    
    // Check for root path (dashboard)
    if (pathname === '/' && itemSlug === 'dashboard') {
      return true;
    }
    
    // Check for exact match or as a prefix
    return pathname === `/${itemSlug}` || pathname.startsWith(`/${itemSlug}/`);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-16 md:pb-0">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-sm shadow-md p-4 min-h-screen">
          <div className="px-4 py-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.slug ? `/${item.slug}` : "#"}
                className="block"
              >
                <Button
                
                  variant={isActive(item.slug) ? "default" : "ghost"}
                  disabled={item.slug===""}
                  className={`w-full justify-start ${
                    isActive(item.slug)
                      ? ""
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <SignOut />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-white shadow-sm">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back,{" "}
                  {session?.user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-600">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Page content gets injected here */}
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md px-2 py-2 border-t">
        <div className="flex justify-between items-center">
          {mobileNavItems.slice(0, 3).map((item) => (
            <Link 
              key={item.label} 
              href={item.slug ? `/${item.slug}` : "#"}
              className="block flex-1"
            >
              <Button
                variant={isActive(item.slug) ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col px-4 h-auto py-2 w-full ${
                  isActive(item.slug) ? "" : "text-gray-600"
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}

          {/* "More" button with slide-out menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col px-4 h-auto py-2 text-gray-600 flex-1"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span className="text-xs">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto max-h-64 pb-8 pt-6 rounded-t-xl"
            >
              <div className="space-y-2">
                {/* Show items not in the main mobile nav */}
                {navItems
                  .filter(item => 
                    !mobileNavItems.slice(0, 3).some(mi => mi.slug === item.slug)
                  )
                  .map(item => (
                    <Link 
                      key={item.label} 
                      href={item.slug ? `/${item.slug}` : "#"}
                      className="block"
                    >
                      <Button
                        variant={isActive(item.slug) ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isActive(item.slug) ? "" : "text-gray-600"
                        }`}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  ))
                }
                <SignOut />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
