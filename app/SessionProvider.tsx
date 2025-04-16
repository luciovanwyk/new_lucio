"use client";

import React, { createContext, useContext, useState } from "react";

export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "PROCUSTOMER"
  | "EDITOR"
  | "ADMIN"
  | "SUPERADMIN"
  | "ROLE_MANAGER"  // <-- Add this line

export interface SessionUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  streetAddress?: string;
  suburb?: string | null;
  townCity?: string;
  postcode?: string;
  country?: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  role: UserRole;
}

interface SessionContextType {
  user: SessionUser;
  updateUser: (updatedUser: Partial<SessionUser>) => void;
  updateAvatar: (newAvatarUrl: string) => void;
  updateBackground: (newBackgroundUrl: string) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export default function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { user: SessionUser };
}) {
  const [user, setUser] = useState<SessionUser>(value.user);

  const updateUser = (updatedUser: Partial<SessionUser>) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
  };

  const updateBackground = (newBackgroundUrl: string) => {
    setUser((prev) => ({ ...prev, backgroundUrl: newBackgroundUrl }));
  };

  return (
    <SessionContext.Provider
      value={{ user, updateUser, updateAvatar, updateBackground }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
