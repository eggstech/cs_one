
'use client';

import { getTicket, interactions as allInteractions } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ArrowLeft, Clock, MessageSquare, Phone, StickyNote } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Interaction } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface CompactTicketDetailProps {
  ticketId: string;
  isWide?: boolean;
  onBack: () => void;
}

const getIcon = (type: Interaction['type']) => {
  switch (type) {
    case 'Call':
      return <Phone className="h-4 w-4" />;
    case 'Chat':
      return <MessageSquare className="h-4 w-4" />;
    case 'Note':
      return <StickyNote className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};


export function CompactTicketDetail({ ticketId, isWide, onBack }: CompactTicketDetailProps) {
    const ticket = getTicket(ticketId);
    if (!ticket) {
        notFound();
    }
    const interactions = allInteractions.filter(i => i.ticketId === ticketId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
         <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className='truncate'>
                    <p className="text-sm font-semibold text-foreground truncate">{ticket.subject}</p>
                    <p className='text-xs text-muted-foreground font-mono'>{ticket.id}</p>
                </div>
            </div>
             <div className='flex justify-between items-center mb-4 text-xs'>
                <div className='flex items-center gap-2'>
                    <Avatar className='w-5 h-5'>
                        <AvatarImage src={ticket.agent.avatarUrl} />
                        <AvatarFallback>{ticket.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{ticket.agent.name}</span>
                </div>
                <Badge variant={ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'secondary' : 'default'} size="sm">{ticket.status}</Badge>
            </div>
            <Separator className='mb-4'/>
            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="relative space-y-4">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
                    {interactions.map(interaction => (
                        <div key={interaction.id} className="relative flex items-start gap-3">
                            <div className="absolute left-3 top-1 -translate-x-1/2 size-6 rounded-full flex items-center justify-center bg-muted">
                                {getIcon(interaction.type)}
                            </div>
                            <div className="flex-1 ml-9">
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(interaction.date), { addSuffix: true })} by {interaction.agent.name}</p>
                                <p className="text-sm py-2">{interaction.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
