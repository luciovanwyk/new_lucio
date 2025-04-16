"use client";

import React from "react";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

export default function Navbar({ isLoggedIn, onLogout, onLogin }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="font-semibold text-lg">Welcome, Manager</div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
