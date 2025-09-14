import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { tickets } from '@/lib/data';
import { PlusCircle, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TicketsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
          <p className="text-muted-foreground">
            Track and resolve customer issues efficiently.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>New</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>In-Progress</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Resolved</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Closed</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">
                    <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.id}
                    </Link>
                  </TableCell>
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
                        <span className="font-medium hover:underline">{ticket.customerName}</span>
                      </div>
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
                      className="capitalize"
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={ticket.agent.avatarUrl} alt={ticket.agent.name} />
                        <AvatarFallback>{ticket.agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{ticket.agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), 'PP')}</TableCell>
                  <TableCell>{format(new Date(ticket.updatedAt), 'PP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
