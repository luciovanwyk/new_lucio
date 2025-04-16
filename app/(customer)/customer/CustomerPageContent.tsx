"use client";

import React, { useState } from "react";
import { useSession } from "../SessionProvider";
import Image from "next/image";
import { User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import ProfileEditModal from "../_components/(sidebar)/ProfileEditModal";
import AvatarUploadForm from "../_components/(sidebar)/AvatarUploadForm";
import BackgroundUploadForm from "../_components/(sidebar)/BackgroundUploadForm";

export default function CustomerPageContent() {
  const { user } = useSession();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"avatar" | "background">("avatar");

  const openEditModal = () => {
    setActiveTab("avatar");
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);

  const handleAvatarUpdateSuccess = (newUrl: string) => {
    // Update avatar in session or state as needed
    setEditModalOpen(false);
  };

  const handleBackgroundUpdateSuccess = (newUrl: string) => {
    // Update background in session or state as needed
    setEditModalOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Top half: Background with overlay */}
      <section
        className="relative h-[50vh] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${user.backgroundUrl || "/default-bg.jpg"})` }}
        aria-label="Profile background section"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32 bg-white rounded-full p-1 shadow-lg border-4 border-white">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName || "User"}
                fill
                sizes="128px"
                className="object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
                <UserIcon size={96} className="text-gray-400" />
              </div>
            )}

            {/* Pencil button positioned at bottom-right of avatar */}
            <button
              onClick={openEditModal}
              className="absolute -bottom-2 -right-2 bg-teal-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:bg-teal-500 transition-colors"
              aria-label="Edit profile picture and background"
              title="Edit profile picture and background"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>
          </div>

          <h1 className="mt-4 text-3xl font-semibold drop-shadow-md">
            {user.displayName || "Customer"}
          </h1>
        </div>
      </section>

      {/* Bottom half: Customer details */}
      <section
        className="flex-grow px-8 py-12 max-w-4xl mx-auto w-full"
        aria-labelledby="customer-details-title"
      >
        <h2
          id="customer-details-title"
          className="text-3xl font-bold mb-8 text-center text-white"
        >
          Customer Details
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto text-white">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <dt className="text-lg font-semibold mb-1">Email</dt>
              <dd className="break-words">{user.email}</dd>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <dt className="text-lg font-semibold mb-1">Phone Number</dt>
              <dd>{user.phoneNumber || "Not provided"}</dd>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-4">
            <MapPin className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <dt className="text-lg font-semibold mb-1">Address</dt>
              <dd className="break-words">
                {[
                  user.streetAddress,
                  user.suburb,
                  user.townCity,
                  user.postcode,
                  user.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Edit Modal */}
      <ProfileEditModal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <div className="w-full max-w-md">
          <div className="flex border-b border-gray-300 mb-6">
            <button
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                activeTab === "avatar"
                  ? "border-b-4 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-teal-600"
              }`}
              onClick={() => setActiveTab("avatar")}
              type="button"
            >
              Change Avatar
            </button>
            <button
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                activeTab === "background"
                  ? "border-b-4 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-teal-600"
              }`}
              onClick={() => setActiveTab("background")}
              type="button"
            >
              Change Background
            </button>
          </div>

          {activeTab === "avatar" && (
            <AvatarUploadForm
              avatarUrl={user.avatarUrl}
              onSuccess={handleAvatarUpdateSuccess}
              onClose={closeEditModal}
            />
          )}

          {activeTab === "background" && (
            <BackgroundUploadForm
              backgroundUrl={user.backgroundUrl}
              onSuccess={handleBackgroundUpdateSuccess}
              onClose={closeEditModal}
            />
          )}
        </div>
      </ProfileEditModal>
    </main>
  );
}
