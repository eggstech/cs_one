
'use client';
import { useState } from 'react';
import { interactions, customers } from '@/lib/data';
import { Interaction } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CompactCallHistoryListProps {
  onSelectCustomer: (customerId: string) => void;
}

const getCallTypeIcon = (callType?: Interaction['callType']) => {
    switch (callType) {
        case 'Incoming':
            return <PhoneIncoming className="h-4 w-4 text-green-500" />;
        case 'Outgoing':
            return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
        case 'Missed':
            return <PhoneMissed className="h-4 w-4 text-red-500" />;
        default:
            return null;
    }
}

// Helper to find customerId from an interaction
const getCustomerIdFromInteraction = (interaction: Interaction) => {
    // If ticket is linked, find customer from ticket
    if (interaction.ticketId) {
        const ticket = interactions.find(i => i.ticketId === interaction.ticketId);
        // This is a simplification; in a real app, you'd fetch the ticket and get customerId
        // For now, let's find the customer who has this ticket
        const customer = customers.find(c => c.interactions.some(i => i.ticketId === interaction.ticketId));
        return customer?.id;
    }
    // Fallback: find customer who has this interaction
    const customer = customers.find(c => c.interactions.some(i => i.id === interaction.id));
    return customer?.id;
}
const getCustomerFromInteraction = (interaction: Interaction) => {
     const customerId = getCustomerIdFromInteraction(interaction);
     return customers.find(c => c.id === customerId);
}


export function CompactCallHistoryList({ onSelectCustomer }: CompactCallHistoryListProps) {
  const allCalls = interactions
    .filter(i => i.type === 'Call')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className='flex flex-col h-full'>
        <ScrollArea className='flex-1 pr-4 -mr-4'>
            <div className="space-y-2">
            {allCalls.map(call => {
                const customer = getCustomerFromInteraction(call);
                if (!customer) return null; // Don't render if we can't find a customer

                return (
                <div 
                    key={call.id} 
                    onClick={() => customer && onSelectCustomer(customer.id)} 
                    className="p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                    <div className='flex justify-between items-center'>
                         <p className="font-medium text-sm leading-tight">{customer.name}</p>
                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getCallTypeIcon(call.callType)}
                            <span>{call.duration || call.callType}</span>
                         </div>
                    </div>
                    <div className='flex justify-between items-center mt-1 text-xs text-muted-foreground'>
                        <p>{call.content}</p>
                        <p>{formatDistanceToNow(new Date(call.date), { addSuffix: true })}</p>
                    </div>
                </div>
            )})}
            </div>
        </ScrollArea>
    </div>
  );
}
