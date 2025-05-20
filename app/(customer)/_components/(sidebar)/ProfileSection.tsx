"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileEditModal from "./ProfileEditModal";
import AvatarUploadForm from "./AvatarUploadForm";
import UserAvatar from "../UserAvatar";
import { useSession } from "../../SessionProvider";

interface ProfileSectionProps {
  user: {
    id?: string;
    displayName?: string;
    avatarUrl?: string | null;
    backgroundUrl?: string | null;
  };
  isCollapsed: boolean;
}

export default function ProfileSection({
  user: initialUser,
  isCollapsed,
}: ProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: sessionUser, updateProfile } = useSession();

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    sessionUser?.avatarUrl ?? initialUser.avatarUrl ?? null
  );
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState<string | null>(
    sessionUser?.backgroundUrl ?? initialUser.backgroundUrl ?? null
  );

  useEffect(() => {
    setCurrentAvatarUrl(sessionUser?.avatarUrl ?? null);
    setCurrentBackgroundUrl(sessionUser?.backgroundUrl ?? null);
  }, [sessionUser?.avatarUrl, sessionUser?.backgroundUrl]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAvatarUpdateSuccess = (
    newAvatarUrl: string | null,
    newBackgroundUrl: string | null
  ) => {
    setCurrentAvatarUrl(newAvatarUrl);
    setCurrentBackgroundUrl(newBackgroundUrl);
    updateProfile({
      avatarUrl: newAvatarUrl ?? undefined,
      backgroundUrl: newBackgroundUrl ?? undefined,
    });
  };

  const displayName =
    sessionUser?.displayName || initialUser.displayName || "Customer Name";

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isCollapsed && "h-0 overflow-hidden"
    )}>
      {/* Background Image Container */}
      <div className="relative w-full h-52 bg-[#e87a64]/80 dark:bg-[#132541]/80 overflow-hidden">
        {currentBackgroundUrl && (
          <Image
            src={currentBackgroundUrl}
            alt={`${displayName}'s background image`}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Edit Background Button */}
        <button
          onClick={openModal}
          className="absolute right-4 top-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          aria-label="Edit background"
        >
          <Pencil size={18} className="text-white" />
        </button>
      </div>

      {/* Centered Avatar Container */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
        <div className="relative">
          <div className="rounded-full border-4 border-white overflow-hidden shadow-xl h-32 w-32">
          <UserAvatar
              avatarUrl={currentAvatarUrl}
              size={isCollapsed ? 112 : 128}
            />
          </div>
        </div>
      </div>

      <ProfileEditModal isOpen={isModalOpen} onClose={closeModal}>
        <AvatarUploadForm
          avatarUrl={currentAvatarUrl}
          backgroundUrl={currentBackgroundUrl}
          onSuccess={handleAvatarUpdateSuccess}
          onClose={closeModal}
        />
      </ProfileEditModal>
    </div>
  );
}