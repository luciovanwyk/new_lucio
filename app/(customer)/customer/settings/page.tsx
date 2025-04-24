"use client";

import React, { useState } from "react";

// Hooks and Context
import { useSession } from "../../SessionProvider";

// Actions and Types
import {
  updateCheckoutDetails,
  updateCustomerProfileInfo,
} from "./_actions/actions";
import {
  CheckoutDetailsFormValues,
  ProfileUpdateFormValues,
} from "./_actions/types";

// UI Components
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
  const { user: sessionUser, updateProfile } = useSession();
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  // Handler for Personal Info Form
  const handleProfileInfoSubmit = async (data: ProfileUpdateFormValues) => {
    setIsSubmittingInfo(true);
    try {
      // First update server-side via the action
      const result = await updateCustomerProfileInfo(data);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      // Then update client-side state
      await updateProfile(data);
      
      toast.success(result.success || "Profile information updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile information.");
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  // Handler for Checkout Details Form
  const handleCheckoutDetailsSubmit = async (
    data: CheckoutDetailsFormValues,
  ) => {
    setIsSubmittingCheckout(true);
    try {
      const result = await updateCheckoutDetails(data);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success(result.success || "Checkout details updated successfully.");
    } catch (error) {
      console.error("Error updating checkout details:", error);
      toast.error("Failed to update checkout details.");
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  // Loading State
  if (!sessionUser) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Render Actual Content
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs defaultValue="personal-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="checkout-details">Checkout Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info" className="mt-6">
          <ProfileInfoForm
            user={sessionUser}
            onSubmit={handleProfileInfoSubmit}
            isSubmitting={isSubmittingInfo}
          />
        </TabsContent>

        {/* Checkout Details Tab */}
        <TabsContent value="checkout-details" className="mt-6">
          <CheckoutDetailsForm
            user={sessionUser}
            onSubmit={handleCheckoutDetailsSubmit}
            isSubmitting={isSubmittingCheckout}
          />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <PasswordChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}