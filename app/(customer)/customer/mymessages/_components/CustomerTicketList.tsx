"use client";
import React, { useState, useMemo } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { TicketStatus } from "@prisma/client";
import type { TicketListItem } from "../page";

interface Props {
  tickets: TicketListItem[];
}

export default function CustomerTicketList({ tickets: initialTickets }: Props) {
  const [tickets] = useState<TicketListItem[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) =>
      ticket.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tickets, search]);

  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredTickets.slice(start, start + entriesPerPage);
  }, [filteredTickets, currentPage, entriesPerPage]);

  return (
    <Card className="bg-[#132541] border border-[#132541]/50 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#e87a64]/10 to-[#132541]/20 p-6 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-[#e87a64]">My Support Tickets</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <Select 
            value={String(entriesPerPage)} 
            onValueChange={(v) => { setEntriesPerPage(Number(v)); setCurrentPage(1); }}
          >
            <SelectTrigger className="w-24 bg-[#132541]/90 hover:bg-[#e87a64]/20 text-[#e87a64] border-[#132541]/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#132541] border-[#132541]/50">
              {ENTRIES_OPTIONS.map((opt) => (
                <SelectItem 
                  key={opt} 
                  value={String(opt)}
                  className="hover:bg-[#e87a64]/20 text-white"
                >
                  {opt} entries
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-64 bg-[#132541]/90 focus-visible:ring-2 focus-visible:ring-[#e87a64] border-[#132541]/50 text-white"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {filteredTickets.length === 0 ? (
          <div className="py-8 text-center text-[#e87a64]/80">
            {search ? "No tickets match your search." : "You have not submitted any support tickets yet."}
          </div>
        ) : (
          <div>
            <Table className="border-separate border-spacing-y-2">
              <TableHeader className="bg-[#132541]/80">
                <TableRow>
                  <TableHead className="font-medium text-[#e87a64]">Title</TableHead>
                  <TableHead className="font-medium text-[#e87a64]">Status</TableHead>
                  <TableHead className="font-medium text-[#e87a64]">Created</TableHead>
                  <TableHead className="font-medium text-[#e87a64]">Last Update</TableHead>
                  <TableHead className="font-medium text-[#e87a64]">Messages</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="hover:bg-[#132541]/30 transition-colors rounded-lg overflow-hidden text-white/90"
                  >
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status as TicketStatus} />
                    </TableCell>
                    <TableCell>{format(new Date(ticket.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {formatDistanceToNowStrict(new Date(ticket.updatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{ticket._count.messages}</TableCell>
                    <TableCell>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-[#e87a64] hover:text-white border-[#132541]/50 text-[#e87a64] transition-colors"
                      >
                        <Link href={`/customer/mymessages/${ticket.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="hover:bg-[#e87a64] hover:text-white border-[#132541]/50 text-[#e87a64] transition-colors"
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const ENTRIES_OPTIONS = [5, 10, 20, 50];
