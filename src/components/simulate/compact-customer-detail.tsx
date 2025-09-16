
'use client';

import { Customer } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Phone, ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { getCustomer, getTicketsForCustomer } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from '../customers/order-history';
import { TicketHistory } from '../customers/ticket-history';
import { CompactInteractionTimeline } from './compact-interaction-timeline';


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

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold text-foreground truncate">{customer.name}</p>
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
                
                <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timeline">
                        <CompactInteractionTimeline interactions={customer.interactions} />
                    </TabsContent>
                    <TabsContent value="tickets">
                        <TicketHistory tickets={customerTickets} />
                    </TabsContent>
                    <TabsContent value="orders">
                        <OrderHistory orders={customer.orders} />
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    </div>
  );
}
