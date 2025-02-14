"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import User from "./auth/user";

export function Navbar() {
  return (
    <header className="mx-auto sticky top-0 z-50 min-w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto container flex h-14 items-center">
        <SidebarTrigger />
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/admin">
            <span className="hidden font-bold sm:inline-block">
              Admin Panel
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <User />
          </nav>
        </div>
      </div>
    </header>
  );
}
