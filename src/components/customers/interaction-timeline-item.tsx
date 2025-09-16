

'use client';
import { Interaction, Ticket } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Phone, MessageSquare, StickyNote, Ticket as TicketIcon, Clock, Link as LinkIcon, PlusCircle } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { CallSummarization } from "./call-summarization";
import { getTicket } from "@/lib/data";

interface InteractionTimelineItemProps {
  interaction: Interaction;
}

const getIcon = (type: Interaction['type']) => {
  switch (type) {
    case 'Call':
      return <Phone className="h-5 w-5" />;
    case 'Chat':
      return <MessageSquare className="h-5 w-5" />;
    case 'Note':
      return <StickyNote className="h-5 w-5" />;
    case 'Ticket':
      return <TicketIcon className="h-5 w-5" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
};

export function InteractionTimelineItem({ interaction }: InteractionTimelineItemProps) {
  const [hydrated, setHydrated] = useState(false);
  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);

  useEffect(() => {
    setHydrated(true);
    if (interaction.ticketId) {
        const foundTicket = getTicket(interaction.ticketId);
        setTicket(foundTicket);
    }
  }, [interaction.ticketId]);
  
  const iconBgColor = 
    interaction.type === 'Call' ? 'bg-blue-500/20 text-blue-400' :
    interaction.type === 'Chat' ? 'bg-green-500/20 text-green-400' :
    interaction.type === 'Note' ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-purple-500/20 text-purple-400';

  const isCall = interaction.type === 'Call';
  const content = isCall ? interaction.purpose || interaction.content : interaction.content;

  const ticketStatusVariant = 
    ticket?.status === 'New' ? 'default' :
    ticket?.status === 'In-Progress' ? 'outline' :
    'secondary';

  return (
    <div className="relative flex items-start gap-4">
      <div className="flex-shrink-0">
          <div className={`absolute left-6 top-0 -translate-x-1/2 size-8 rounded-full flex items-center justify-center ${iconBgColor}`}>
              {getIcon(interaction.type)}
          </div>
          <Avatar className="mt-12 ml-1">
            <AvatarImage src={interaction.agent.avatarUrl} alt={interaction.agent.name} />
            <AvatarFallback>{interaction.agent.name.slice(0,2)}</AvatarFallback>
          </Avatar>
      </div>

      <div className="flex-1 mt-11">
        <Card className="bg-card/80">
          <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{interaction.agent.name}</CardTitle>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3"/>
                    {hydrated && (
                      <time dateTime={interaction.date} title={format(new Date(interaction.date), 'PPpp')}>
                          {formatDistanceToNow(new Date(interaction.date), { addSuffix: true })}
                      </time>
                    )}
                </div>
              </div>
            <CardDescription className="text-xs">{interaction.type} via {interaction.channel}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <p className="text-sm">{content}</p>
            {isCall && <CallSummarization interaction={interaction} />}
          </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-end gap-4 text-xs text-muted-foreground">
               <div className="w-full flex justify-end">
                {interaction.ticketId && ticket ? (
                    <Link href={`/tickets/${interaction.ticketId}`}>
                        <Badge variant={ticketStatusVariant}>
                            <TicketIcon className="mr-2 h-3 w-3" />
                            {interaction.ticketId}
                        </Badge>
                    </Link>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="sm">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Link to Ticket
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/tickets/new?subject=${encodeURIComponent(interaction.content)}`}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create New Ticket
                                </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Link to Existing
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
               </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
