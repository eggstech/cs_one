'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  PhoneIncoming,
  Ticket,
  MessageSquare,
} from 'lucide-react';
import { tickets, customers } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ScreenPop } from '@/components/screen-pop';
import { PancakeWidget } from '@/components/pancake-widget';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const [isScreenPopVisible, setScreenPopVisible] = useState(false);
  
  const handleSimulateCall = () => {
    setScreenPopVisible(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +5 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Time
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3h 15m</div>
            <p className="text-xs text-muted-foreground">
              Average for today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>
              A list of the most recently updated tickets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.slice(0, 5).map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/customers/${ticket.customerId}`}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={ticket.customerAvatarUrl}
                              alt={ticket.customerName}
                            />
                            <AvatarFallback>
                              {ticket.customerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium hover:underline">
                            {ticket.customerName}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.subject}
                      </Link>
                    </TableCell>
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
                     <TableCell>
                      {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9" />
              </div>
              <Button onClick={handleSimulateCall} className="w-full">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Simulate Incoming Call
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Pancake Chat Widget
              </CardTitle>
              <CardDescription>
                Live preview of the smart widget integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PancakeWidget customer={customers[0]} />
            </CardContent>
          </Card>
        </div>
      </div>
      <ScreenPop
        customer={customers[2]}
        open={isScreenPopVisible}
        onOpenChange={setScreenPopVisible}
      />
    </div>
  );
}
