
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { tickets as allTickets } from '@/lib/data';
import { Ticket } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';


interface CompactTicketListProps {
    onSelectTicket: (ticketId: string) => void;
}

export function CompactTicketList({ onSelectTicket }: CompactTicketListProps) {
  const [query, setQuery] = useState('');
  const filteredTickets = query 
    ? allTickets.filter(t => t.subject.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())) 
    : allTickets;

  return (
    <div className='flex flex-col h-full'>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search tickets by subject or ID..." 
                className="pl-9" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
        </div>
        <ScrollArea className='flex-1 pr-4 -mr-4'>
            <div className="space-y-2">
            {filteredTickets.map(ticket => (
                <div 
                    key={ticket.id} 
                    onClick={() => onSelectTicket(ticket.id)} 
                    className="p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                    <div className='flex justify-between items-start'>
                         <p className="font-medium text-sm leading-tight pr-2">{ticket.subject}</p>
                          <Badge variant={ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'secondary' : 'default'} size="sm">{ticket.status}</Badge>
                    </div>
                   
                    <div className='flex justify-between items-center mt-1'>
                        <p className="text-xs text-muted-foreground font-mono">{ticket.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</p>
                    </div>
                </div>
            ))}
            </div>
        </ScrollArea>
    </div>
  );
}
