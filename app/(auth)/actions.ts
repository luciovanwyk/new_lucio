"use server";


import { validateRequest } from "@/auth";
import { lucia } from "@/lib/auth.config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Add artificial delay to show loading state (optional)
  // await new Promise(resolve => setTimeout(resolve, 1000));

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}
