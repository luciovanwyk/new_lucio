import React from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import { Prisma, TicketStatus } from "@prisma/client";
import CustomerTicketList from "./_components/CustomerTicketList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import AnimatedCard from "./_components/AnimatedCard";

const _myTicketListItemPayload =
  Prisma.validator<Prisma.SupportTicketDefaultArgs>()({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      status: true,
      messages: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
  });

export type TicketListItem = Prisma.SupportTicketGetPayload<
  typeof _myTicketListItemPayload
>;

type GetMyTicketsResult = TicketListItem[];

const myTicketQueryArgs = (userId: string) =>
  ({
    where: { creatorId: userId },
    select: _myTicketListItemPayload.select,
    orderBy: { createdAt: "desc" as const },
  }) satisfies Prisma.SupportTicketFindManyArgs;

async function getMyTickets(userId: string): Promise<GetMyTicketsResult> {
  try {
    const args = myTicketQueryArgs(userId);
    const tickets = await prisma.supportTicket.findMany(args);
    return tickets ?? [];
  } catch (error) {
    console.error("Failed to fetch user's tickets:", error);
    return [];
  }
}

export default async function MyMessagesPage() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  const myTickets = await getMyTickets(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedCard>
        <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-primary/20 shadow-2xl w-full p-8 rounded-xl">
          <CardHeader className="flex flex-col items-center space-y-4 pb-6">
            <div className="p-4 rounded-full bg-primary/20 border-2 border-primary/30 shadow-inner">
              <MessageSquare className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              My Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-background/80 p-6 rounded-lg border border-border/50 shadow-inner">
            <CustomerTicketList tickets={myTickets} />
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}
