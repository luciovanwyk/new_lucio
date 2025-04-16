import React from "react";
import { redirect } from "next/navigation";
import CustomerPageContent from "./CustomerPageContent";
import { validateRequest } from "@/auth";
import SessionProvider from "../SessionProvider";

export default async function CustomerPage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <SessionProvider value={{ user, session }}>
      <CustomerPageContent />
    </SessionProvider>
  );
}
