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
import { Loader2 } from "lucide-react";
import { CheckoutDetailsFormValues, checkoutDetailsSchema } from "../_actions/types";
import { SessionUser } from "@/app/(customer)/SessionProvider";

interface CheckoutDetailsFormProps {
  user: SessionUser & {
    streetAddress?: string | null;
    suburb?: string | null;
    townCity?: string | null;
  };
  onSubmit: (data: CheckoutDetailsFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const CheckoutDetailsForm: React.FC<CheckoutDetailsFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutDetailsFormValues>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      companyName: "",
      country: user.country || "",
      streetAddress: user.streetAddress || "",
      apartmentSuite: user.suburb || "", // Map to the correct field name
      townCity: user.townCity || "",
      province: "", // Add missing required field
      postcode: user.postcode || "",
      phone: user.phoneNumber || "", // Map to the correct field name
      email: user.email || "",
    },
  });

  return (
    <Card className="shadow-lg border-2 border-green-200">
      <CardHeader>
        <CardTitle>
          <span role="img" aria-label="cart">🛒</span> Checkout Details
        </CardTitle>
        <CardDescription>
          Make your next purchase a breeze! Fill in your shipping & billing info below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            🚚 Shipping Info
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="checkout-firstName">First Name</Label>
              <Input
                id="checkout-firstName"
                placeholder="e.g. Jane"
                {...register("firstName")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-green-400"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 animate-shake">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="checkout-lastName">Last Name</Label>
              <Input
                id="checkout-lastName"
                placeholder="e.g. Doe"
                {...register("lastName")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-green-400"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 animate-shake">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-country">Country / Region</Label>
            <Input
              id="checkout-country"
              placeholder="Where in the world are you?"
              {...register("country")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.country && (
              <p className="text-sm text-red-600 animate-shake">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-streetAddress">Street Address</Label>
            <Input
              id="checkout-streetAddress"
              placeholder="123 Rainbow Road"
              {...register("streetAddress")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-600 animate-shake">
                {errors.streetAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-apartmentSuite">Apartment, suite, etc.</Label>
            <Input
              id="checkout-apartmentSuite"
              placeholder="(Optional)"
              {...register("apartmentSuite")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.apartmentSuite && (
              <p className="text-sm text-red-600 animate-shake">{errors.apartmentSuite.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-townCity">Town / City</Label>
            <Input
              id="checkout-townCity"
              placeholder="e.g. Cape Town"
              {...register("townCity")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.townCity && (
              <p className="text-sm text-red-600 animate-shake">{errors.townCity.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-province">Province</Label>
            <Input
              id="checkout-province"
              placeholder="e.g. Western Cape"
              {...register("province")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.province && (
              <p className="text-sm text-red-600 animate-shake">{errors.province.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-postcode">Postcode</Label>
            <Input
              id="checkout-postcode"
              placeholder="e.g. 8001"
              {...register("postcode")}
              disabled={isSubmitting}
              className="focus:ring-2 focus:ring-green-400"
            />
            {errors.postcode && (
              <p className="text-sm text-red-600 animate-shake">{errors.postcode.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="checkout-phone">Phone</Label>
              <Input
                id="checkout-phone"
                type="tel"
                placeholder="We'll text you updates! 📱"
                {...register("phone")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-green-400"
              />
              <span className="text-xs text-gray-400">For delivery updates only.</span>
              {errors.phone && (
                <p className="text-sm text-red-600 animate-shake">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="checkout-email">Email Address</Label>
              <Input
                id="checkout-email"
                type="email"
                placeholder="you@email.com"
                {...register("email")}
                disabled={isSubmitting}
                className="focus:ring-2 focus:ring-green-400"
              />
              <span className="text-xs text-gray-400">We&apos;ll never spam you. Promise!</span>
              {errors.email && (
                <p className="text-sm text-red-600 animate-shake">{errors.email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400 transition-all duration-300 font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Details...
              </>
            ) : (
              <>🎉 Update Details</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CheckoutDetailsForm;