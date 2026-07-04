"use client";

import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="h-16 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-950/50 backdrop-blur px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                    Chat Room
                </h2>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center">
                    <ThemeToggle />
                </div>

                {/* User badge */}
                {session?.user && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4 text-violet-500" />
                        <span>{session.user.name}</span>
                    </div>
                )}

                {/* Logout Button */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all px-3.5 py-1.5 rounded-xl text-sm font-bold active:scale-[0.98]"
                    title="Sign Out"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
