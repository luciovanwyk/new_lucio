"use client";

import React from "react";
import LoginForm from "./_components/LoginForm";

export default function Page() {
  return (
    <div
      className="
        min-h-screen 
        flex flex-col items-center justify-center 
        bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500 
        text-white
        px-4
      "
      style={{ animation: "fadeIn 1s ease-in forwards" }}
    >
      <header className="mb-8 text-center max-w-md">
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-2">
          Welcome Back! <span aria-label="wave" role="img">👋</span>
        </h1>
        <p className="text-lg font-light drop-shadow-md">
          Let&apos;s get you signed in and ready to catch some data! 🐟
        </p>
      </header>

      <main className="w-full max-w-md bg-white rounded-xl p-8 text-gray-900 shadow-md">
        <LoginForm />
      </main>

      <footer className="mt-10 text-white/70 text-sm select-none">
        <p>
          New here?{" "}
          <a
            href="/register"
            className="underline hover:text-white transition-colors"
          >
            Create an account
          </a>{" "}
          and join the adventure! 🚀
        </p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
