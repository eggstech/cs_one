
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
import { Clock, Ticket, Phone, PhoneMissed, PhoneOutgoing, PhoneIncoming, AlertTriangle, ArrowRight, User } from 'lucide-react';
import { Interaction, CallEvent } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { CallSummarization } from '../customers/call-summarization';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CallDetailModalProps {
  interaction: Interaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEventIcon = (type: CallEvent['type']) => {
    switch(type) {
        case 'Ringing': return <PhoneIncoming className="size-4" />;
        case 'Answered': return <Phone className="size-4" />;
        case 'Missed': return <PhoneMissed className="size-4 text-destructive" />;
        case 'Ended': return <PhoneOutgoing className="size-4" />;
        case 'Transferred': return <ArrowRight className="size-4" />;
        case 'Initiated': return <User className="size-4" />;
        default: return <AlertTriangle className="size-4" />;
    }
}
const getEventColor = (type: CallEvent['type']) => {
    switch(type) {
        case 'Answered': return 'bg-green-500/20 text-green-600';
        case 'Missed': return 'bg-red-500/20 text-red-600';
        case 'Transferred': return 'bg-blue-500/20 text-blue-600';
        default: return 'bg-muted text-muted-foreground';
    }
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
          <DialogTitle>Call Details ({interaction.id})</DialogTitle>
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

          {interaction.events && interaction.events.length > 0 && (
            <>
                <Separator />
                <div className='space-y-4'>
                    <h4 className="font-semibold">Call Events</h4>
                    <div className="relative space-y-6">
                         <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
                        {interaction.events.map(event => (
                             <div key={event.id} className="relative flex items-start gap-4">
                                 <div className={cn("absolute left-5 top-1 -translate-x-1/2 size-10 rounded-full flex items-center justify-center", getEventColor(event.type))}>
                                     {getEventIcon(event.type)}
                                 </div>
                                 <div className="flex-1 ml-16">
                                     <p className="font-semibold">{event.type}</p>
                                     <div className="text-xs text-muted-foreground flex items-center gap-4">
                                        <div className='flex items-center gap-1'>
                                            <User className="size-3" /> 
                                            <span>{event.agent.name}</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Clock className="size-3" />
                                            <time dateTime={event.date} title={format(new Date(event.date), 'PPpp')}>
                                                {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                                            </time>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </>
          )}

          {interaction.ticketId && (
            <>
                <Separator />
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Linked Ticket</h4>
                    <Link href={`/tickets/${interaction.ticketId}`}>
                        <Badge variant="outline" className="hover:bg-accent">
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
