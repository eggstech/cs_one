
'use client';
import { Interaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Phone, MessageSquare, StickyNote, Ticket, Clock, Sparkles, Loader2, Link as LinkIcon, PlusCircle } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { summarizeCall, SummarizeCallOutput } from "@/ai/flows/summarize-call";
import { Input } from "../ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";

interface InteractionTimelineItemProps {
  interaction: Interaction;
  onCallEnd?: (interaction: Interaction) => void;
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

export function InteractionTimelineItem({ interaction, onCallEnd }: InteractionTimelineItemProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeCallOutput | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // State for live call management
  const [isLive, setIsLive] = useState(interaction.isLive || false);
  const [duration, setDuration] = useState(0);
  const [callDetails, setCallDetails] = useState({
    purpose: interaction.purpose || '',
    discussion: interaction.discussion || '',
    output: interaction.output || '',
    nextAction: interaction.nextAction || '',
  });

  useEffect(() => {
    setHydrated(true);
    let timer: NodeJS.Timeout;
    if (isLive) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLive]);
  
  const formatDuration = (seconds: number) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      const time = date.toISOString().substr(14, 5);
      return time;
  };

  const handleEndCall = () => {
    setIsLive(false);
    if (onCallEnd) {
        onCallEnd({
            ...interaction,
            ...callDetails,
            isLive: false,
            duration: formatDuration(duration),
            transcript: `Agent: Thank you for calling CS-One, how can I help?\nCustomer: I have a question about my bill.` // Mock transcript
        });
    }
  }


  const handleSummarize = async () => {
      setIsSummarizing(true);
      setSummary(null);
      try {
          // This should ideally use the actual audio from the interaction
          const result = await summarizeCall({ audioDataUri: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMA==" });
          setSummary(result);
      } catch (error) {
          console.error("Summarization failed", error);
      } finally {
          setIsSummarizing(false);
      }
  };

  const iconBgColor = 
    interaction.type === 'Call' ? 'bg-blue-500/20 text-blue-400' :
    interaction.type === 'Chat' ? 'bg-green-500/20 text-green-400' :
    interaction.type === 'Note' ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-purple-500/20 text-purple-400';

  const isCall = interaction.type === 'Call';

  if (isLive) {
     return (
        <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
                <div className={`absolute left-6 top-0 -translate-x-1/2 size-8 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400`}>
                    <Phone className="h-5 w-5" />
                </div>
                <Avatar className="mt-12 ml-1">
                    <AvatarImage src={interaction.agent.avatarUrl} alt={interaction.agent.name} />
                    <AvatarFallback>{interaction.agent.name.slice(0,2)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 mt-11">
                <Card className="bg-card/80 border-primary shadow-lg">
                    <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant={'default'}>
                                    <Phone className="mr-2 h-4 w-4 animate-pulse"/>
                                    Live Call
                                </Badge>
                                <span className="text-sm text-muted-foreground font-mono">{formatDuration(duration)}</span>
                            </CardTitle>
                            <Button variant="destructive" size="sm" onClick={handleEndCall}>
                                <Phone className="mr-2 h-4 w-4"/>
                                End Call
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="call-purpose">Purpose</Label>
                            <Input id="call-purpose" placeholder="e.g., Follow up on recent order" value={callDetails.purpose} onChange={e => setCallDetails({...callDetails, purpose: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="call-discussion">Discussion Summary</Label>
                                <Textarea id="call-discussion" placeholder="Summarize the key points of the conversation..." value={callDetails.discussion} onChange={e => setCallDetails({...callDetails, discussion: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="call-output">Output / Resolution</Label>
                                <Input id="call-output" placeholder="e.g., Customer agreed to exchange, sent return label" value={callDetails.output} onChange={e => setCallDetails({...callDetails, output: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="call-next-action">Next Action</Label>
                                <Input id="call-next-action" placeholder="e.g., Follow up in 3 days to check shipping status" value={callDetails.nextAction} onChange={e => setCallDetails({...callDetails, nextAction: e.target.value})} />
                            </div>
                    </CardContent>
                </Card>
            </div>
        </div>
     )
  }

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
          <CardContent className="p-4 pt-0">
            <p className="text-sm">{interaction.content}</p>

            {isCall && interaction.transcript && (
                 <div className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor={`transcript-${interaction.id}`} className="font-semibold">Transcript</Label>
                        <Textarea id={`transcript-${interaction.id}`} readOnly value={interaction.transcript} className="mt-2 min-h-48 font-mono text-xs" />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSummarize} disabled={isSummarizing}>
                            {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                            AI Summarize Call
                        </Button>
                    </div>
                    {summary && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <h4 className="font-bold text-sm mb-2">AI Summary</h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">Summary:</span> {summary.summary}</p>
                                <p><span className="font-semibold">Sentiment:</span> {summary.sentiment}</p>
                                <p><span className="font-semibold">Key Topics:</span> {summary.keyTopics}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </CardContent>
            <CardFooter className="p-4 pt-0 flex-col items-start gap-4 text-xs text-muted-foreground">
               {isCall && interaction.duration && (
                <span>Call Duration: {interaction.duration}</span>
               )}
               <div className="w-full flex justify-end">
                {interaction.ticketId ? (
                    <Link href={`/tickets/${interaction.ticketId}`}>
                        <Badge>
                            <Ticket className="mr-2 h-3 w-3" />
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

    