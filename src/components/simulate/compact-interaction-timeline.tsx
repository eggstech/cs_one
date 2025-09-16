
'use client';
import { Interaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Phone, MessageSquare, StickyNote, Ticket } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface CompactInteractionTimelineProps {
  interactions: Interaction[];
}

const getIcon = (type: Interaction['type']) => {
  switch (type) {
    case 'Call':
      return <Phone className="h-4 w-4" />;
    case 'Chat':
      return <MessageSquare className="h-4 w-4" />;
    case 'Note':
      return <StickyNote className="h-4 w-4" />;
    case 'Ticket':
        return <Ticket className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

export function CompactInteractionTimeline({ interactions }: CompactInteractionTimelineProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  
  if (interactions.length === 0) {
    return <p className="text-sm text-center text-muted-foreground py-8">No interactions logged.</p>
  }

  return (
    <div className="relative space-y-6 pt-4">
        <div className="absolute left-3 top-6 bottom-2 w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
        {interactions.map((interaction) => (
            <div key={interaction.id} className="relative flex items-start gap-3">
                 <div className="absolute left-3 top-1 -translate-x-1/2 size-6 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                    {getIcon(interaction.type)}
                </div>
                <div className="flex-1 ml-9">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold">{interaction.agent.name}</span>
                        <span className="text-muted-foreground">
                           {hydrated && formatDistanceToNow(new Date(interaction.date), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm mt-1">{interaction.content}</p>
                    {interaction.ticketId && (
                        <Link href={`/tickets/${interaction.ticketId}`} className="mt-2 inline-block">
                             <Badge variant="outline" className="hover:bg-accent">
                                <Ticket className="mr-2 h-3 w-3" />
                                {interaction.ticketId}
                            </Badge>
                        </Link>
                    )}
                </div>
            </div>
        ))}
    </div>
  );
}
