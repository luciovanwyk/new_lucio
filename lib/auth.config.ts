import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import prisma from "@/lib/prisma";

// Create the Prisma adapter for Lucia
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Create and export the Lucia instance directly
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      displayName: attributes.displayName,
      email: attributes.email,
      phoneNumber: attributes.phoneNumber,
      streetAddress: attributes.streetAddress,
      suburb: attributes.suburb,
      townCity: attributes.townCity,
      postcode: attributes.postcode,
      country: attributes.country,
      avatarUrl: attributes.avatarUrl,
      backgroundUrl: attributes.backgroundUrl,
      role: attributes.role,
      tier: attributes.tier,
    };
  },
});

// Declare the Lucia type so TypeScript can understand it
export type Auth = typeof lucia;