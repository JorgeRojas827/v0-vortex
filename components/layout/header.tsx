"use client";

import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border bg-black/80 px-6 backdrop-blur-md">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
        <Input
          placeholder="Search repositories, PRs, alignments..."
          className="h-9 w-full border-border bg-[#111111] pl-9 text-sm text-white placeholder:text-[#555555] focus:border-[#333333] focus:ring-0"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] text-[#555555]">
          /
        </kbd>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-[#888888] hover:bg-white/5 hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-white/5">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#1a1a1a] text-xs text-white">
                  <User className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-[#ededed]">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-border bg-[#0a0a0a]">
            <DropdownMenuItem className="text-[#ededed] focus:bg-white/5">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-[#ededed] focus:bg-white/5">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-[#ededed] focus:bg-white/5">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
