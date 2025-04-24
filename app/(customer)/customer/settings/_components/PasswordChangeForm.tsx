"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  PasswordChangeFormValues,
  passwordChangeSchema,
} from "../_actions/types";
import { changePassword } from "../_actions/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function PasswordChangeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    setIsSubmitting(true);
    form.clearErrors();

    try {
      const result = await changePassword(data);

      if (result.success) {
        toast.success(result.message || "Password updated! 🎉");
        form.reset();
      } else {
        toast.error(result.error || "Failed to update password. 😞");

        if (result.fieldErrors?.currentPassword) {
          form.setError("currentPassword", {
            type: "server",
            message: result.fieldErrors.currentPassword,
          });
        }
        if (result.fieldErrors?.confirmNewPassword) {
          form.setError("confirmNewPassword", {
            type: "server",
            message: result.fieldErrors.confirmNewPassword,
          });
        }
      }
    } catch (error) {
      console.error("Client error changing password:", error);
      toast.error("An unexpected client error occurred. 🙁");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-2 border-red-200">
      <CardHeader>
        <CardTitle>
          <span role="img" aria-label="lock">
            🔒
          </span>{" "}
          Change Password
        </CardTitle>
        <CardDescription>
          Keep your account secure! Update to a strong, unique password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      {...field}
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-red-400"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 animate-shake" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password (min. 8 characters)"
                      {...field}
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-red-400"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 animate-shake" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      {...field}
                      disabled={isSubmitting}
                      className="focus:ring-2 focus:ring-red-400"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 animate-shake" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-bold transition-all duration-300"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Updating..." : "Change Password"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
