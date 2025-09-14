import {
  Card,
  CardContent,
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
import { Button } from '@/components/ui/button';
import { customers } from '@/lib/data';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

export default function CustomersPage() {
  const knownCustomers = customers.filter(c => c.name !== 'Unrecognized Caller');
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            View and manage your customer database.
          </p>
        </div>
        <div className="flex items-center space-x-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search customers..." className="pl-9" />
           </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Total Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knownCustomers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                     <Link href={`/customers/${customer.id}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={customer.avatarUrl}
                            alt={customer.name}
                          />
                          <AvatarFallback>
                            {customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium hover:underline">{customer.name}</span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                   <TableCell>{customer.phone}</TableCell>
                  <TableCell>{format(new Date(customer.createdAt), 'PP')}</TableCell>
                  <TableCell className="text-center">{customer.orders.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
