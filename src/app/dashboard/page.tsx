"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    User,
    Home,
    Settings,
    Bell,
    PieChart,
    Calendar,
    Mail,
    Menu,
    X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react"

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const navItems = [
        { icon: Home, label: "Home", active: true },
        { icon: PieChart, label: "Analytics" },
        { icon: Calendar, label: "Calendar" },
        { icon: Mail, label: "Messages" },
        { icon: Settings, label: "Settings" },
    ];

    // Simplified mobile navigation - only show 4 most important items
    const mobileNavItems = [
        { icon: Home, label: "Home", active: true },
        { icon: PieChart, label: "Analytics" },
        { icon: Calendar, label: "Calendar" },
        { icon: Menu, label: "More" },
    ];

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
                            <Button
                                key={item.label}
                                variant={item.active ? "default" : "ghost"}
                                className={`w-full justify-start ${
                                    item.active
                                        ? ""
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                    <div className="mt-auto">
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => signOut()}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Sign Out
                        </Button>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Activity Summary
                                </CardTitle>
                                <CardDescription>
                                    Your recent activity statistics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {["Today", "This Week", "This Month"].map(
                                        (period) => (
                                            <div
                                                key={period}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm text-gray-600">
                                                    {period}
                                                </span>
                                                <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                                                        style={{
                                                            width: `${Math.floor(
                                                                Math.random() *
                                                                    100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Recent Tasks
                                </CardTitle>
                                <CardDescription>
                                    Your upcoming deadlines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {[
                                        "Complete project plan",
                                        "Review pull requests",
                                        "Team meeting",
                                    ].map((task) => (
                                        <li
                                            key={task}
                                            className="flex items-center"
                                        >
                                            <div className="w-4 h-4 border border-gray-300 rounded-sm mr-3"></div>
                                            <span className="text-sm">
                                                {task}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>
                                    Common actions you might need
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "New Project",
                                        "Add Task",
                                        "Schedule Meeting",
                                        "Send Message",
                                    ].map((action) => (
                                        <Button
                                            key={action}
                                            variant="outline"
                                            size="sm"
                                            className="justify-start"
                                        >
                                            {action}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar - Simplified with fewer items */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md px-2 py-2 border-t">
                <div className="flex justify-between items-center">
                    {mobileNavItems.slice(0, 3).map((item) => (
                        <Button
                            key={item.label}
                            variant={item.active ? "default" : "ghost"}
                            size="sm"
                            className={`flex flex-col px-4 h-auto py-2 ${
                                item.active ? "" : "text-gray-600"
                            }`}
                        >
                            <item.icon className="h-5 w-5 mb-1" />
                            <span className="text-xs">{item.label}</span>
                        </Button>
                    ))}

                    {/* "More" button with slide-out menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex flex-col px-4 h-auto py-2 text-gray-600"
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
                                {/* Additional menu items */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-600"
                                >
                                    <Mail className="mr-2 h-5 w-5" />
                                    Messages
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-600"
                                >
                                    <Settings className="mr-2 h-5 w-5" />
                                    Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 mt-4"
                                    onClick={() =>
                                        signOut()
                                    }
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Sign Out
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}
