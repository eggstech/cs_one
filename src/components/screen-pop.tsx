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
import { Phone, UserPlus, ArrowRight, X, PhoneIncoming } from 'lucide-react';
import { Customer } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ScreenPopProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScreenPop({ customer, open, onOpenChange }: ScreenPopProps) {
  const router = useRouter();
  const isKnownCaller = customer.name !== 'Unrecognized Caller';
  
  const newTicketLink = `/tickets/new?customerId=${customer.id}&subject=${encodeURIComponent(`Phone Call with ${customer.name}`)}`;

  const handleAnswer = () => {
    router.push(newTicketLink);
    onOpenChange(false);
  };

  const handleDecline = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PhoneIncoming className="h-5 w-5 text-primary" />
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
        <DialogFooter className="grid grid-cols-2 gap-2">
          {isKnownCaller ? (
            <>
              <Button variant="outline" asChild>
                <Link href={`/customers/${customer.id}`}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button onClick={handleAnswer}>
                <Phone className="mr-2 h-4 w-4" />
                Answer
              </Button>
            </>
          ) : (
             <Button className="col-span-2" onClick={handleAnswer}>
                 <Phone className="mr-2 h-4 w-4" />
                Answer & Create Profile
            </Button>
          )}
        </DialogFooter>
        <div className="mt-2">
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleDecline}>
                <X className="mr-2 h-4 w-4" />
                Decline
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
