// src/components/membership/CurrentTierStatus.tsx
"use client"; // KEEP THIS

import React from "react";
import { Medal, Clock, ArrowRight } from "lucide-react";
import { getTierConfig } from "@/lib/config/tiers";

// Types for the component props
type CurrentTierStatusProps = {
  currentTier: string; // e.g., "GOLD"
  userName?: string;
  latestApplication: {
    id: string;
    package: string; // e.g., "PLATINUM"
    createdAt: Date;
  } | null;
};

export default function CurrentTierStatus({
  currentTier,
  userName,
  latestApplication,
}: CurrentTierStatusProps) {
  // Get configurations using the helper function from centralized config
  const currentTierConfig = getTierConfig(currentTier);
  const appliedTierConfig = latestApplication
    ? getTierConfig(latestApplication.package)
    : null;

  // Format application date if exists
  const formattedDate = latestApplication
    ? new Date(latestApplication.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div>
      <div className="flex items-start justify-between mb-4"> {/* Added mb-4 */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Current Membership Status
          </h2>
          <div className="flex items-center gap-2"> {/* Removed mb-4 */}
            <span className="font-medium text-gray-700">
              Hello, {userName || "Customer"}
            </span>
            <span className="text-gray-500">|</span>
            <span className="font-medium">Your current tier:</span>
          </div>
        </div>
        {/* Optional: Add button or link here if needed */}
      </div>

      {/* Current Tier Display */}
      <div
        className={`flex items-center p-4 rounded-lg ${currentTierConfig.bgColor} ${currentTierConfig.borderColor} border mb-6`}
      >
        <Medal className={`w-12 h-12 mr-4 ${currentTierConfig.color}`} />
        <div>
          <h3 className="text-lg font-semibold">{currentTierConfig.title}</h3>
          <p className="text-gray-700">Enjoy your exclusive benefits.</p> {/* Slightly adjusted text */}
        </div>
      </div>

      {/* Current Benefits */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Your Current Benefits:</h3> {/* Added mb-3 */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"> {/* Adjusted grid and gap */}
          {currentTierConfig.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700"> {/* Adjusted text color */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 mr-2 flex-shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pending Application */}
      {latestApplication && appliedTierConfig && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" /> {/* Adjusted color */}
            <h3 className="font-semibold text-gray-800">Pending Application</h3> {/* Adjusted color */}
          </div>

          <div className="flex items-center gap-3 mb-4"> {/* Added mb-4 */}
            {/* Current Tier Icon */}
            <div className={`p-3 rounded-lg ${currentTierConfig.bgColor}`}>
              <Medal className={`w-6 h-6 ${currentTierConfig.color}`} />
            </div>

            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

            {/* Applied Tier Icon */}
            <div className={`p-3 rounded-lg ${appliedTierConfig.bgColor}`}>
              <Medal className={`w-6 h-6 ${appliedTierConfig.color}`} />
            </div>

            {/* Application Details */}
            <div className="flex-1 min-w-0"> {/* Added for text wrapping */}
              <p className="font-medium text-gray-800">{appliedTierConfig.title}</p>
              <p className="text-sm text-gray-600 truncate"> {/* Added truncate */}
                Application submitted on {formattedDate}
              </p>
            </div>
          </div>

          <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200 text-blue-800"> {/* Adjusted colors */}
            Your application is currently under review. This process typically takes 2-3 business days. We will notify you once your application has been processed.
          </p>
        </div>
      )}
    </div>
  );
}