"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";

interface ProfileSectionProps {
  isCollapsed: boolean;
}

export default function ProfileSection({ isCollapsed }: ProfileSectionProps) {
  return (
    <div
      className={`flex items-center ${
        isCollapsed ? "py-4 px-2 justify-center" : "py-6 px-6 justify-start"
      } bg-slate-800`}
    >
      {!isCollapsed && (
        <>
          <LayoutDashboard className="w-6 h-6 text-slate-200 mr-3" />
          <h2 className="text-lg font-semibold text-slate-200 tracking-wide select-none">
            My Dashboard
          </h2>
        </>
      )}

      {isCollapsed && (
        <LayoutDashboard className="w-6 h-6 text-slate-200" />
      )}
    </div>
  );
}
