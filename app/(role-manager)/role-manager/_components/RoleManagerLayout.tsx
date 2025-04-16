"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function RoleManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    // TODO: Add real logout logic here (clear tokens, call API, etc)
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />

        <main className="flex-1 p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
