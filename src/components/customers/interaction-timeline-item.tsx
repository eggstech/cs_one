
'use client';
import { Interaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Phone, MessageSquare, StickyNote, Ticket, Clock, Sparkles, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { summarizeCall, SummarizeCallOutput } from "@/ai/flows/summarize-call";

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
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeCallOutput | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
          {isCall && interaction.duration && (
             <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                Call Duration: {interaction.duration}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
