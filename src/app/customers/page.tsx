'use client';
import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { customers } from '@/lib/data';
import { PlusCircle, Search, Columns } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/lib/types';

type ColumnVisibility = {
  [key in keyof Partial<Customer> | 'totalOrders' | 'membershipLevel']: boolean;
};

export default function CustomersPage() {
  const knownCustomers = customers.filter(c => c.name !== 'Unrecognized Caller');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    totalOrders: true,
    membershipLevel: true,
    tags: false,
  });

  const columnNames: { id: keyof ColumnVisibility; label: string }[] = [
      { id: 'name', label: 'Customer' },
      { id: 'email', label: 'Email' },
      { id: 'phone', label: 'Phone' },
      { id: 'createdAt', label: 'Member Since' },
      { id: 'totalOrders', label: 'Total Orders' },
      { id: 'membershipLevel', label: 'Membership Level' },
      { id: 'tags', label: 'Tags' },
  ];

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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Columns className="mr-2 h-4 w-4" />
                        View
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columnNames.map(column => (
                         <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={columnVisibility[column.id]}
                            onCheckedChange={(value) =>
                                setColumnVisibility(prev => ({...prev, [column.id]: !!value}))
                            }
                        >
                            {column.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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
                {columnVisibility.name && <TableHead>Customer</TableHead>}
                {columnVisibility.email && <TableHead>Email</TableHead>}
                {columnVisibility.phone && <TableHead>Phone</TableHead>}
                {columnVisibility.createdAt && <TableHead>Member Since</TableHead>}
                {columnVisibility.totalOrders && <TableHead className="text-center">Total Orders</TableHead>}
                {columnVisibility.membershipLevel && <TableHead>Membership</TableHead>}
                {columnVisibility.tags && <TableHead>Tags</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {knownCustomers.map((customer) => (
                <TableRow key={customer.id}>
                   {columnVisibility.name && (
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
                  )}
                  {columnVisibility.email && <TableCell>{customer.email}</TableCell>}
                  {columnVisibility.phone && <TableCell>{customer.phone}</TableCell>}
                  {columnVisibility.createdAt && <TableCell>{format(new Date(customer.createdAt), 'PP')}</TableCell>}
                  {columnVisibility.totalOrders && <TableCell className="text-center">{customer.orders.length}</TableCell>}
                  {columnVisibility.membershipLevel && (
                    <TableCell>
                        {customer.membership ? (
                             <Badge variant="secondary">{customer.membership.level}</Badge>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>
                  )}
                  {columnVisibility.tags && (
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {customer.tags.map(tag => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                        </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
