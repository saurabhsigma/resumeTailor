"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Globe, LogOut, Moon, Sun, Monitor, Wand2, Gauge, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Note: DropdownMenu might not be implemented yet in UI folder, if correct, I need to implement it or use simple method.
// I will implement a simpler theme toggle and logout button for now to avoid dependency on dropdown-menu primitive if not installed.

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tighter">
                    <span className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-transparent bg-clip-text">ResumeTailor</span>
                </div>
                <nav className="flex-1 p-4 espacio-y-2">
                    <Link href="/dashboard">
                        <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/resumes">
                        <Button variant={pathname.includes("/resumes") ? "secondary" : "ghost"} className="w-full justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            My Resumes
                        </Button>
                    </Link>
                    <Link href="/dashboard/portfolios">
                        <Button variant={pathname.includes("/portfolios") ? "secondary" : "ghost"} className="w-full justify-start">
                            <Globe className="mr-2 h-4 w-4" />
                            My Portfolios
                        </Button>
                    </Link>
                    <Link href="/dashboard/tailor">
                        <Button variant={pathname.includes("/tailor") ? "secondary" : "ghost"} className="w-full justify-start">
                            <Wand2 className="mr-2 h-4 w-4" />
                            Smart Tailor
                        </Button>
                    </Link>
                    <Link href="/dashboard/ats">
                        <Button variant={pathname.includes("/ats") ? "secondary" : "ghost"} className="w-full justify-start">
                            <Gauge className="mr-2 h-4 w-4" />
                            ATS Checker
                        </Button>
                    </Link>
                    <Link href="/dashboard/billing">
                        <Button variant={pathname.includes("/billing") ? "secondary" : "ghost"} className="w-full justify-start">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Billing
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t space-y-2">
                    <div className="flex items-center justify-between pb-2">
                        <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
                            <Sun className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
                            <Moon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme("system")}>
                            <Monitor className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="destructive" className="w-full justify-start" onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (TODO: Hamburger menu for mobile) */}
                <header className="md:hidden h-16 border-b flex items-center px-4 justify-between">
                    <span className="font-bold">ResumeTailor</span>
                    <Button size="sm" variant="outline" onClick={() => signOut()}>Logout</Button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
