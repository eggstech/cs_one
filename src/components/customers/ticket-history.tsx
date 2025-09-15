
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState, useEffect } from "react";

interface TicketHistoryProps {
  tickets: Ticket[];
}

export function TicketHistory({ tickets }: TicketHistoryProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket History</CardTitle>
        <CardDescription>A list of tickets associated with this customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length > 0 ? tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono">
                    <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.id}
                    </Link>
                </TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.status === 'Resolved' || ticket.status === 'Closed'
                        ? 'secondary'
                        : ticket.status === 'New'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {hydrated && formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No tickets found for this customer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
