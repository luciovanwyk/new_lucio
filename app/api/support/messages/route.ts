import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.supportMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
