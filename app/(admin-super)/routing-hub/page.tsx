// app/(admin-super)/routing-hub/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const RoutingHub = () => {
  const router = useRouter();

  const handleAdminDashboard = () => {
    router.push("/admin");
  };

  const handleHomePage = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 space-y-8 text-center w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-4">Super Admin Hub</h2>
        <p className="text-lg text-gray-600 mb-6">Where to next?</p>
        <div className="flex space-x-6 justify-center">
          <button
            onClick={handleAdminDashboard}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Admin Dashboard
          </button>
          <button
            onClick={handleHomePage}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Home Page
          </button>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-500">
        Effortless Navigation
      </footer>
    </div>
  );
};

export default RoutingHub;
