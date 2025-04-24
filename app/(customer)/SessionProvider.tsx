"use client";

import React, { createContext, useContext, useState } from "react";
import { ProfileUpdateFormValues } from "./customer/settings/_actions/types";

export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "PROCUSTOMER"
  | "EDITOR"
  | "ADMIN"
  | "SUPERADMIN"
  | "ROLE_MANAGER";

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

export interface SessionWithUser {
  id: string; // example session property
  // add other session properties as needed
}

interface SessionContextType {
  user: SessionUser;
  session: SessionWithUser;
  updateUser: (updatedUser: Partial<SessionUser>) => void;
  updateAvatar: (newAvatarUrl: string) => void;
  updateBackground: (newBackgroundUrl: string) => void;
  // Add updateProfile function to SessionContextType
  updateProfile: (data: ProfileUpdateFormValues) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export default function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { user: SessionUser; session: SessionWithUser };
}) {
  const [userData, setUserData] = useState<SessionUser>(value.user);

  const updateUser = (updatedUser: Partial<SessionUser>) => {
    setUserData((prev) => ({ ...prev, ...updatedUser }));
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setUserData((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
  };

  const updateBackground = (newBackgroundUrl: string) => {
    setUserData((prev) => ({ ...prev, backgroundUrl: newBackgroundUrl }));
  };

  // Add updateProfile implementation
  const updateProfile = async (data: ProfileUpdateFormValues): Promise<void> => {
    // Update local state with profile data
    setUserData((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber || undefined, // Convert null to undefined
      streetAddress: data.streetAddress,
      suburb: data.suburb,
      townCity: data.townCity,
      postcode: data.postcode,
      country: data.country,
    }));
    
    return Promise.resolve();
  };

  return (
    <SessionContext.Provider
      value={{
        user: userData,
        session: value.session,
        updateUser,
        updateAvatar,
        updateBackground,
        updateProfile, // Include the new function in the context value
      }}
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