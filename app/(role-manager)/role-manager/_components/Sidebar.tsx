"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/role-manager/reports", label: "Reports" },
  { href: "/role-manager/users", label: "Users" },
  { href: "/role-manager/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 font-bold text-xl">
        Manager Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-2 rounded hover:bg-gray-200 ${
              pathname === href ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
