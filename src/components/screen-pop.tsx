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
        <DialogFooter>
          {isKnownCaller ? (
            <Link href={`/customers/${customer.id}`} passHref legacyBehavior>
              <Button className="w-full" onClick={() => onOpenChange(false)}>
                View Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
             <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Create New Profile <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
