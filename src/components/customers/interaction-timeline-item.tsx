import { Interaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Phone, MessageSquare, StickyNote, Ticket, Clock } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { CallSummarization } from "./call-summarization";

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
      return <Ticket className="h-5 w-5" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
};

export function InteractionTimelineItem({ interaction }: InteractionTimelineItemProps) {
  const iconBgColor = 
    interaction.type === 'Call' ? 'bg-blue-500/20 text-blue-400' :
    interaction.type === 'Chat' ? 'bg-green-500/20 text-green-400' :
    interaction.type === 'Note' ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-purple-500/20 text-purple-400';

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
                    <time dateTime={interaction.date} title={format(new Date(interaction.date), 'PPpp')}>
                        {formatDistanceToNow(new Date(interaction.date), { addSuffix: true })}
                    </time>
                </div>
              </div>
            <CardDescription className="text-xs">{interaction.type} via {interaction.channel}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm">{interaction.content}</p>
          </CardContent>
          {interaction.type === 'Call' && (
            <CardFooter className="p-4 pt-0">
              <CallSummarization interaction={interaction} />
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
