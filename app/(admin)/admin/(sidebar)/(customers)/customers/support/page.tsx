import React from "react";
import { headers } from 'next/headers';
import { TicketTable } from "./TicketTable";
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Support - Tickets",
  description: "Manage customer support tickets",
};

type TicketWithIncludes = Prisma.SupportTicketGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        username: true;
        email: true;
        avatarUrl: true;
        role: true;
      };
    };
    messages: {
      include: {
        sender: {
          select: {
            id: true;
            username: true;
            email: true;
            avatarUrl: true;
            role: true;
          };
        };
      };
    };
    _count: {
      select: { messages: true };
    };
  };
}>;

type MessageWithIncludes = TicketWithIncludes['messages'][number];

async function getTickets() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tickets.map((ticket: TicketWithIncludes) => ({
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      creator: {
        ...ticket.creator,
        avatarUrl: ticket.creator.avatarUrl || null
      },
      messages: ticket.messages.map((message: MessageWithIncludes) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
        sender: {
          ...message.sender,
          avatarUrl: message.sender.avatarUrl || null
        }
      }))
    }));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

// Make sure to declare this as a React Server Component
const Page = async () => {
  const tickets = await getTickets();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Support Tickets
        </h1>
      </div>
      
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No support tickets found.
          </p>
        </div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </div>
  );
};

// Make sure to export the component as default
export default Page;