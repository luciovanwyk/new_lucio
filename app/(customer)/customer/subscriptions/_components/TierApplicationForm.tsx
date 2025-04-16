"use client"; // KEEP THIS

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Medal } from "lucide-react";
import { TierApplicationFormData, TierPackage } from "../types";
import { tierApplicationSchema } from "../validations";
import { getTierConfig, TIER_CONFIG, TIER_ORDER, TierLevel } from "@/lib/config/tiers"; // Import all tier-related constants
import { submitTierApplication } from "../_actions/actions";

type TierApplicationFormProps = {
  currentTier: string; // e.g., "GOLD"
  lastAppliedTier?: string | null; // e.g., "PLATINUM", allow null
};

export default function TierApplicationForm({
  currentTier,
  lastAppliedTier,
}: TierApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine initial selected tier based on lastAppliedTier, ensuring it's a valid TierPackage
  const getInitialSelectedTier = (): TierPackage | undefined => {
      if (lastAppliedTier && Object.values(TierPackage).includes(lastAppliedTier as TierPackage)) {
          return lastAppliedTier as TierPackage;
      }
      return undefined;
  };
  const [selectedTier, setSelectedTier] = useState<TierPackage | undefined>(getInitialSelectedTier());

  const {
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<TierApplicationFormData>({
    resolver: zodResolver(tierApplicationSchema),
    defaultValues: { package: selectedTier },
  });

  // Filter available tiers using shared config
  const currentTierIndex = TIER_ORDER.indexOf(currentTier?.toUpperCase() as TierLevel);

  // Get available tiers strictly higher than the current one and part of TierPackage enum
  const availableTiers = Object.entries(TIER_CONFIG)
    .filter(([tierKey, _config]) => {
      if (!Object.values(TierPackage).includes(tierKey as TierPackage)) {
          return false; // Only include SILVER, GOLD, PLATINUM
      }
      const tierIndex = TIER_ORDER.indexOf(tierKey as TierLevel);
      return tierIndex > currentTierIndex; // Only higher tiers
    })
    .reduce((acc, [key, value]) => {
        acc[key as TierPackage] = value;
        return acc;
    }, {} as Record<TierPackage, typeof TIER_CONFIG[keyof typeof TIER_CONFIG]>);

  // Effect to update form state if lastAppliedTier prop changes externally
  useEffect(() => {
    const initialTier = getInitialSelectedTier();
    setSelectedTier(initialTier);
    // Reset form with the potentially new default value
    reset({ package: initialTier });
  }, [lastAppliedTier, reset]);

  // Watch form value and update local state
  const watchPackage = watch("package");
  useEffect(() => {
    if (watchPackage && watchPackage !== selectedTier) {
        setSelectedTier(watchPackage);
    } else if (!watchPackage && selectedTier !== undefined) {
        setSelectedTier(undefined);
    }
  }, [watchPackage, selectedTier]);

  const onSelectTier = (tier: TierPackage) => {
    setSelectedTier(tier);
    setValue("package", tier, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: TierApplicationFormData) => {
    if (!selectedTier) {
        toast.error("Please select a tier to apply for.");
        return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting application...");

    try {
      const result = await submitTierApplication(data);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit application.", { id: toastId });
      }
    } catch (error) {
      console.error("Tier application submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred.",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render logic ---
  const renderApplicationForm = () => {
    if (Object.keys(availableTiers).length === 0 && !lastAppliedTier) {
      return (
        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <Medal className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
          <p className="text-gray-700 font-medium">
            Congratulations! You&apos;ve reached our highest available tier.
          </p>
          <p className="text-sm text-gray-500 mt-1">Enjoy all the exclusive benefits.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Selection Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {Object.entries(availableTiers).map(([tierKey, config]) => {
              const tier = tierKey as TierPackage;
              return (
                <div
                  key={tier}
                  onClick={() => onSelectTier(tier)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTier(tier)}
                  role="radio"
                  aria-checked={selectedTier === tier}
                  tabIndex={0}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 ${
                    selectedTier === tier
                      ? `${config.borderColor} ${config.bgColor} shadow-lg ring-2 ring-offset-1 ${config.borderColor.replace('border-', 'ring-')}`
                      : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedTier === tier ? config.borderColor.replace('border-', 'border-') + ' bg-white' : 'border-gray-400'}`}>
                       {selectedTier === tier && <div className={`w-2.5 h-2.5 rounded-full ${config.bgColor.replace('bg-', 'bg-')}`}></div>}
                    </div>
                    <span className={`font-semibold ${selectedTier === tier ? config.color : 'text-gray-800'}`}>
                      {config.title}
                    </span>
                  </div>
                  <div className="flex justify-center my-4">
                    <Medal className={`w-10 h-10 ${config.color}`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3 min-h-[40px]">{config.description || ""}</p>
                  <ul className="text-sm space-y-1.5 text-gray-700">
                    {config.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-teal-500 mr-1.5 mt-0.5 flex-shrink-0">
                           <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.84-10.215a.75.75 0 0 0-1.14-.08L5.856 8.5H5.75a.75.75 0 0 0-.69.458L3.93 11.08a.75.75 0 1 0 1.34.64l.98-2.056 1.4 1.4a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-.08-1.14l-2.5-1.625Z" />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                    {config.benefits.length > 3 && <li className="text-xs text-gray-500 pt-1">... and more!</li>}
                  </ul>
                </div>
              );
            })}
          </div>
          {/* Form error display */}
          {errors.package && (
            <p className="text-red-600 text-sm mt-2" role="alert">
              {errors.package.message}
            </p>
          )}
        </div>

        {/* Submission Area */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-4">
            By submitting this application, your account will be reviewed for eligibility for the selected tier. This process typically takes 2-3 business days.
          </p>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !selectedTier}
              className="inline-flex items-center justify-center px-6 py-2 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                 </>
              ) : (
                lastAppliedTier && selectedTier === lastAppliedTier
                  ? "Update Application"
                  : "Submit Application"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Conditional rendering for existing application ---
  if (lastAppliedTier) {
      const appliedTierConfig = getTierConfig(lastAppliedTier);
      return (
          <div>
              {/* Application Status Display */}
              <div className={`bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8 text-blue-800 text-sm`}>
                  <div className="flex items-center mb-2">
                      <div className={`p-1.5 rounded-full ${appliedTierConfig.bgColor} mr-2.5 flex-shrink-0`}>
                          <Medal className={`w-5 h-5 ${appliedTierConfig.color}`} />
                      </div>
                      <h3 className="font-semibold">Application Under Review</h3>
                  </div>
                  <p className="pl-[34px]">
                      You applied for the <strong>{appliedTierConfig.title}</strong>. We&apos;re reviewing your application (usually 2-3 business days) and will notify you once processed.
                  </p>
              </div>

              {/* Option to change application */}
              <h3 className="text-lg font-semibold mb-2">Change Your Application?</h3>
              <p className="text-sm text-gray-600 mb-6">
                  Select a different tier below to update your pending application.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>{renderApplicationForm()}</form>
          </div>
      );
  }

  // Default: Render the form for a new application
  return (
      <div>
          <h2 className="text-xl font-semibold mb-2">Apply for a Higher Tier</h2>
          <p className="text-sm text-gray-600 mb-6">Select the membership tier you wish to apply for below.</p>
          <form onSubmit={handleSubmit(onSubmit)}>{renderApplicationForm()}</form>
      </div>
  );
}