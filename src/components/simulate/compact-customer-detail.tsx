
'use client';

import { Customer, Interaction, Ticket } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Phone, Mail, ShoppingBag, ArrowLeft, Ticket as TicketIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { getCustomer, getTicketsForCustomer } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';

interface CompactCustomerDetailProps {
  customerId: string;
  isWide?: boolean;
  onBack: () => void;
  onSelectTicket: (ticketId: string) => void;
}

export function CompactCustomerDetail({ customerId, isWide = false, onBack, onSelectTicket }: CompactCustomerDetailProps) {
  const customer = getCustomer(customerId);
  
  if (!customer) {
    notFound();
  }

  const customerTickets = getTicketsForCustomer(customerId);
  const latestOrder = customer.orders.length > 0 ? customer.orders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold text-foreground">Customer Details</p>
        </div>
        <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className={cn(isWide ? "h-20 w-20" : "h-12 w-12")}>
                        <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person face" />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className={cn("font-semibold text-foreground", isWide ? "text-xl" : "text-lg")}>{customer.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="size-3" /> {customer.phone}</span>
                        </div>
                        {isWide && <p className="text-sm text-muted-foreground">{customer.email}</p>}
                    </div>
                </div>

                {isWide && (
                    <div className="flex flex-wrap gap-2">
                        {customer.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        {customer.membership && <Badge variant="outline">{customer.membership.level} Member</Badge>}
                    </div>
                )}
                
                <Separator />
                
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                        <ShoppingBag className="size-4" /> Recent Order
                    </h4>
                    {latestOrder ? (
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-foreground">{latestOrder.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium text-foreground">{format(new Date(latestOrder.date), 'PP')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium text-foreground">{latestOrder.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium text-foreground">${latestOrder.total.toFixed(2)}</span>
                        </div>
                    </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No orders found.</p>
                    )}
                </div>

                {customerTickets.length > 0 && (
                    <>
                    <Separator />
                     <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                            Recent Tickets
                        </h4>
                        <div className="space-y-2">
                            {customerTickets.slice(0, 3).map(ticket => (
                                <div key={ticket.id} onClick={() => onSelectTicket(ticket.id)} className="text-sm p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                                    <p className="font-semibold truncate">{ticket.subject}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                            {ticket.id}
                                        </p>
                                        <Badge variant={ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'secondary' : 'default'} size="sm">{ticket.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </>
                )}
            </div>
        </ScrollArea>
    </div>
  );
}
