"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, SessionUser } from "../../SessionProvider";

// Import actions and types
import {
  updateCheckoutPreferences,
  updateCustomerProfileInfo,
  changePassword
} from "./_actions/actions";
import type { ProfileUpdateActionResult } from "./_actions/actions";
import {
  CheckoutDetailsFormValues,
  ProfileUpdateFormValues,
  PasswordChangeFormValues
} from "./_actions/types";

import ProfileInfoForm from "./_components/ProfileInfoForm";
import CheckoutDetailsForm from "./_components/CheckoutDetailsForm";
import PasswordChangeForm from "./_components/PasswordChangeForm";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerSettingsPage() {
  const { user: sessionUser, updateProfile: updateClientSessionProfile } = useSession();
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const validTabs = ["personal-info", "checkout-details", "security"];
  const defaultTabValue = initialTab && validTabs.includes(initialTab) ? initialTab : "personal-info";

  const [currentUserData, setCurrentUserData] = useState<SessionUser | null>(sessionUser);
  
  useEffect(() => {
    setCurrentUserData(sessionUser);
  }, [sessionUser]);

  const handleProfileInfoSubmit = async (data: ProfileUpdateFormValues): Promise<void> => {
    if (!updateClientSessionProfile) {
      toast.error("Session context error.");
      return;
    }
    setIsSubmittingInfo(true);
    try {
      const result: ProfileUpdateActionResult = await updateCustomerProfileInfo(data);
      if (result.success) {
        toast.success(result.success);
        if (result.updatedUser) {
          updateClientSessionProfile(result.updatedUser);
          setCurrentUserData((prev) => prev ? { ...prev, ...result.updatedUser } : null);
        }
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  const handleCheckoutPreferencesSubmit = async (data: CheckoutDetailsFormValues): Promise<void> => {
    setIsSubmittingCheckout(true);
    try {
      const result = await updateCheckoutPreferences(data);
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating checkout preferences:", error);
      toast.error("An unexpected error occurred saving preferences.");
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  const handlePasswordChange = async (data: PasswordChangeFormValues): Promise<void> => {
    setIsSubmittingPassword(true);
    try {
      const result = await changePassword(data);
      if (result.success) {
        toast.success("Password updated successfully");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (!currentUserData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Tabs defaultValue={defaultTabValue} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="checkout-details">Checkout Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info" className="mt-6">
          <ProfileInfoForm
            key={`profile-${currentUserData.id}-${JSON.stringify(currentUserData)}`}
            user={currentUserData}
            onSubmit={handleProfileInfoSubmit}
            isSubmitting={isSubmittingInfo}
          />
        </TabsContent>

        <TabsContent value="checkout-details" className="mt-6">
          <CheckoutDetailsForm
            onSubmit={handleCheckoutPreferencesSubmit}
            isSubmitting={isSubmittingCheckout}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
  <PasswordChangeForm
    onSubmit={handlePasswordChange}
    isSubmitting={isSubmittingPassword}
  />
</TabsContent>
      </Tabs>
    </div>
  );
}