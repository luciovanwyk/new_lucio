"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import Link from "next/link";

// Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// ---> ADD THIS IMPORT <---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; // Make sure you have lucide-react installed

// Types
import { OrderInput } from "./order-types";

interface CheckoutFormProps {
  form: UseFormReturn<OrderInput>;
  onSubmit: (data: OrderInput) => Promise<void>;
  isSubmitting: boolean;
  hasItems: boolean;
}

export default function CheckoutForm({
  form,
  onSubmit,
  isSubmitting,
  hasItems,
}: CheckoutFormProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> {/* Increased spacing between cards */}

          {/* Order Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Branch, collection, and reference information.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Captivity Branch */}
               <FormField
                control={form.control}
                name="captivityBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captivity Branch*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    //   defaultValue={field.value} // Remove defaultValue when using value
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="johannesburg">
                          Johannesburg
                        </SelectItem>
                        <SelectItem value="cape_town">Cape Town</SelectItem>
                        <SelectItem value="durban">Durban</SelectItem>
                        <SelectItem value="pretoria">Pretoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Collection Method */}
              <FormField
                control={form.control}
                name="methodOfCollection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Method*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    //   defaultValue={field.value} // Remove defaultValue when using value
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="courier">Courier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sales Rep */}
              <FormField
                control={form.control}
                name="salesRep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Rep</FormLabel>
                    <FormControl>
                      {/* Handle potential null/undefined value for optional fields */}
                      <Input placeholder="Your sales rep name (optional)" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference Number */}
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reference Number</FormLabel>
                    <FormControl>
                      {/* Handle potential null/undefined value */}
                      <Input placeholder="Purchase order number, etc. (optional)" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Billing Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
              <CardDescription>Contact and address information for invoicing.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company's registered name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Phone */}
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact phone number" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email for order updates" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Street Address */}
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="House number and street name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Apartment, Suite, etc. */}
              <FormField
                control={form.control}
                name="apartmentSuite"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Apartment, Suite, etc. <span className="text-gray-500 text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, unit, etc."
                        {...field}
                        // Handle potential null/undefined value
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Town/City */}
              <FormField
                control={form.control}
                name="townCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town / City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Town or City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Postal Code */}
               <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Province */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    //   defaultValue={field.value} // Remove defaultValue when using value
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gauteng">Gauteng</SelectItem>
                        <SelectItem value="western_cape">Western Cape</SelectItem>
                        <SelectItem value="kwazulu_natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="eastern_cape">Eastern Cape</SelectItem>
                        <SelectItem value="free_state">Free State</SelectItem>
                        <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="limpopo">Limpopo</SelectItem>
                        <SelectItem value="north_west">North West</SelectItem>
                        <SelectItem value="northern_cape">Northern Cape</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Country/Region */}
               <FormField
                control={form.control}
                name="countryRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country / Region*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    //   defaultValue={field.value} // Remove defaultValue when using value
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        {/* Add other countries if needed */}
                        {/* <SelectItem value="Namibia">Namibia</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Information Section */}
           <Card>
             <CardHeader>
               <CardTitle>Additional Information</CardTitle>
             </CardHeader>
             <CardContent>
               <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes <span className="text-gray-500 text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any special instructions for your order (e.g., delivery notes)."
                          className="min-h-[100px]"
                          {...field}
                          // Handle potential null/undefined value
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </CardContent>
           </Card>

          {/* Payment and Terms Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment & Terms</CardTitle>
              <CardDescription>Select your payment method and agree to terms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               {/* --- Payment Method Field --- */}
               <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    //   defaultValue={field.value} // Remove defaultValue when using value
                      value={field.value} // Controlled component
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="eft">
                            EFT (Electronic Funds Transfer)
                        </SelectItem>
                        <SelectItem value="account">
                            On Account (Requires Approved Account)
                        </SelectItem>
                        {/* Add other methods if needed */}
                        {/* <SelectItem value="card_offline">Credit Card (Processed Offline)</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                        Payment details will be on the proforma invoice sent via email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Privacy Policy Notice */}
              <p className="text-sm text-gray-600">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <Link href="/privacy-policy" className="underline hover:text-black">privacy policy</Link>.
              </p>

              {/* Checkboxes */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="receiveEmailReviews"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="receiveEmailReviews"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                       <FormLabel htmlFor="receiveEmailReviews" className="font-normal text-sm cursor-pointer">
                         Receive an email to review products after delivery.
                       </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="agreeTerms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="agreeTerms" className="font-normal text-sm cursor-pointer">
                          I have read and agree to the website{" "}
                          <Link href="/terms-conditions" className="underline hover:text-black">terms and conditions</Link>*
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>


           {/* Proforma Invoice Alert */}
           {/* This uses the imported Alert components */}
           <Alert>
              <Terminal className="h-4 w-4" /> {/* Ensure Terminal is imported */}
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                By placing your order, you agree to our terms and conditions. A proforma invoice with payment details (if applicable) will be sent to your registered email address shortly after confirmation.
              </AlertDescription>
            </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4">
            <Link href="/cart" className="w-full sm:w-auto" passHref legacyBehavior>
                <Button
                    variant="outline"
                    className="w-full" // Full width on mobile
                    type="button"
                    size="lg"
                >
                    Back to Cart
                </Button>
            </Link>

            <Button
              type="submit"
              className="w-full sm:w-auto" // Full width on mobile
              disabled={isSubmitting || !hasItems}
              size="lg"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}