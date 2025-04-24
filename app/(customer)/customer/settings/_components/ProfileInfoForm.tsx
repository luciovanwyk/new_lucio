"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { SessionUser } from "@/app/(customer)/SessionProvider";
import {
  ProfileUpdateFormValues,
  profileUpdateSchema,
} from "../_actions/types";

interface ProfileInfoFormProps {
  user: SessionUser & {
    phoneNumber?: string | null;
    streetAddress?: string | null;
    suburb?: string | null;
    townCity?: string | null;
    postcode?: string | null;
  };
  onSubmit: (data: ProfileUpdateFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      displayName: user.displayName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      streetAddress: user.streetAddress || "",
      suburb: user.suburb || "",
      townCity: user.townCity || "",
      postcode: user.postcode || "",
      country: user.country || "",
    },
  });

  return (
    <Card className="shadow-xl border-2 border-indigo-200">
      <CardHeader>
        <CardTitle>
          <span role="img" aria-label="person">👤</span> Personal Information
        </CardTitle>
        <CardDescription>
          Keep your profile fresh! Update your details and address below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold">
              📝 Basic Info
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="e.g. Jane"
                  {...register("firstName")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Doe"
                  {...register("lastName")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="What should we call you?"
                  {...register("displayName")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.displayName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Unique & fun!"
                  {...register("username")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.username && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="(Optional) 📱"
                  {...register("phoneNumber")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-xs text-gray-400">
                  We’ll only use this for important updates!
                </span>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold">
              🏡 Address
            </div>
            <div className="space-y-1">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                placeholder="123 Rainbow Road"
                {...register("streetAddress")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-indigo-400"
              />
              {errors.streetAddress && (
                <p className="text-sm text-red-600 animate-pulse">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="suburb">Suburb / Apt / Unit #</Label>
              <Input
                id="suburb"
                placeholder="(Optional)"
                {...register("suburb")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-indigo-400"
              />
              {errors.suburb && (
                <p className="text-sm text-red-600 animate-pulse">
                  {errors.suburb.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="townCity">Town / City</Label>
                <Input
                  id="townCity"
                  placeholder="e.g. Cape Town"
                  {...register("townCity")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.townCity && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.townCity.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  placeholder="e.g. 8001"
                  {...register("postcode")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.postcode && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.postcode.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div></div>
              <div className="space-y-1">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g. South Africa"
                  {...register("country")}
                  disabled={isSubmitting}
                  className="focus:ring-2 focus:ring-indigo-400"
                />
                {errors.country && (
                  <p className="text-sm text-red-600 animate-pulse">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-gradient-to-r from-indigo-400 to-pink-400 hover:from-pink-400 hover:to-indigo-400 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>💾 Save Changes</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileInfoForm;
