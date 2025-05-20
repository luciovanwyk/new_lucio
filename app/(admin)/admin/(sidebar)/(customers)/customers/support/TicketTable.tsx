"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { TicketStatus } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  MessageSquareReply,
  CheckCircle,
  LoaderCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TicketWithDetails } from "./_actions/types";

interface TicketTableProps {
  tickets: TicketWithDetails[];
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isPending, startTransition] = useTransition();
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleRowClick = (ticketId: string) => {
    router.push(`/admin/customers/support/${ticketId}`);
  };

  // Memoized filtering logic
  const filteredTickets = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!Array.isArray(tickets)) return [];
    if (!lowerSearchTerm) return tickets;
    return tickets.filter(
      (ticket) =>
        (ticket?.title?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (ticket?.creator?.username?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (ticket?.creator?.email?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (ticket?.id?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (ticket?.status?.toLowerCase().replace("_", " ") ?? "").includes(lowerSearchTerm)
    );
  }, [tickets, searchTerm]);

  // Pagination logic
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredTickets.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredTickets, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);

  const handleStatusUpdate = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      setUpdatingTicketId(ticketId);
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      toast.success('Ticket status updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label
              htmlFor="entries-select"
              className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
            >
              Show entries
            </label>
            <select
              id="entries-select"
              name="entries"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              aria-label="Number of entries per page"
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>{value} entries</option>
              ))}
            </select>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                id="ticket-search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary w-64"
                aria-label="Search tickets"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${showFilters ? 'bg-primary/10' : ''}`}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              {/* Add your filter controls here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {[
                'ID', 'Title', 'Status', 'Reported by', 'Date',
                'Messages', 'Last Message', 'Actions'
              ].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedTickets.map((ticket, index) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleRowClick(ticket.id)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {ticket.creator.avatarUrl ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={ticket.creator.avatarUrl}
                            alt={ticket.creator.username}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {ticket.creator.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {ticket.creator.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ticket.creator.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ticket._count.messages}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ticket.messages[0] && (
                      formatDistanceToNowStrict(new Date(ticket.messages[0].createdAt), { addSuffix: true })
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/customers/support/${ticket.id}`);
                          }}
                        >
                          <MessageSquareReply className="h-4 w-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(ticket.id, TicketStatus.OPEN);
                          }}
                          disabled={ticket.status === TicketStatus.OPEN || updatingTicketId === ticket.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Set as Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(ticket.id, TicketStatus.IN_PROGRESS);
                          }}
                          disabled={ticket.status === TicketStatus.IN_PROGRESS || updatingTicketId === ticket.id}
                        >
                          <LoaderCircle className="h-4 w-4 mr-2" />
                          Set In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(ticket.id, TicketStatus.RESOLVED);
                          }}
                          disabled={ticket.status === TicketStatus.RESOLVED || updatingTicketId === ticket.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(ticket.id, TicketStatus.CLOSED);
                          }}
                          disabled={ticket.status === TicketStatus.CLOSED || updatingTicketId === ticket.id}
                          className="text-red-600 dark:text-red-400"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Close Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <motion.div
        className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, filteredTickets.length)} of {filteredTickets.length} entries
        </span>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};