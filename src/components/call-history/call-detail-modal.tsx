
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Clock, Ticket } from 'lucide-react';
import { Interaction } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { CallSummarization } from '../customers/call-summarization';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface CallDetailModalProps {
  interaction: Interaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CallDetailModal({ interaction, open, onOpenChange }: CallDetailModalProps) {
  if (!interaction) {
    return null;
  }

  // Assuming customer is part of the interaction object for this component
  const customer = 'customer' in interaction ? (interaction as any).customer : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
          <DialogDescription>
            A detailed record of the phone call interaction.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            {customer && (
                 <Link href={`/customers/${customer.id}`} className="flex items-center gap-4 group">
                    <Avatar className="h-16 w-16">
                    <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <h3 className="text-lg font-semibold group-hover:underline">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
              </Link>
            )}
            <div className="text-right space-y-1 text-sm">
                <div className="flex items-center gap-2 justify-end">
                     <Avatar className="h-6 w-6">
                        <AvatarImage src={interaction.agent.avatarUrl} alt={interaction.agent.name} />
                        <AvatarFallback>{interaction.agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{interaction.agent.name}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{format(new Date(interaction.date), 'PPpp')}</span>
                </div>
                 {interaction.duration && (
                    <p className="text-xs text-muted-foreground">Duration: {interaction.duration}</p>
                )}
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{interaction.content}</h4>
            <CallSummarization interaction={interaction} />
          </div>

          {interaction.ticketId && (
            <>
                <Separator />
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Linked Ticket</h4>
                    <Link href={`/tickets/${interaction.ticketId}`}>
                        <Badge>
                            <Ticket className="mr-2 h-3 w-3" />
                            {interaction.ticketId}
                        </Badge>
                    </Link>
                </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

