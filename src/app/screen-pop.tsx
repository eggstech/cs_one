'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Phone, UserPlus, ArrowRight } from 'lucide-react';
import { Customer } from '@/lib/types';
import Link from 'next/link';

interface ScreenPopProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScreenPop({ customer, open, onOpenChange }: ScreenPopProps) {
  const isKnownCaller = customer.name !== 'Unrecognized Caller';

  const newTicketLink = `/tickets/new?customerId=${customer.id}&subject=${encodeURIComponent(`Phone Call with ${customer.name}`)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Incoming Call
          </DialogTitle>
          <DialogDescription>
            {isKnownCaller
              ? `Call from a recognized number.`
              : `Call from an unrecognized number.`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person face" />
              <AvatarFallback>
                {customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          {isKnownCaller ? (
            <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} asChild>
                    <Link href={`/customers/${customer.id}`}>
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button className="flex-1" onClick={() => onOpenChange(false)} asChild>
                    <Link href={newTicketLink}>
                        Create Ticket <UserPlus className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          ) : (
             <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onOpenChange(false)} asChild>
                 <Link href="/tickets/new">
                    Create New Profile <UserPlus className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
