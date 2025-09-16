
'use client';
import { Interaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Phone, MessageSquare, StickyNote, Ticket, Clock, PhoneOff, Sparkles, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { summarizeCall, SummarizeCallOutput } from "@/ai/flows/summarize-call";
import { Input } from "../ui/input";

interface InteractionTimelineItemProps {
  interaction: Interaction;
  onCallEnd?: (interaction: Interaction) => void;
}

const mockTranscript = `Agent: Thank you for calling CS-One, this is Alex speaking. How can I help you today?
Customer: Hi Alex, this is John Doe. I'm calling about my recent order, ORD-001. I received it yesterday but the frames aren't quite what I expected. I'd like to start a return.
Agent: I see. I'm sorry to hear that the frames weren't to your liking, Mr. Doe. I can certainly help you with a return. Can you confirm the order ID for me?
Customer: Yes, it's ORD-001.
Agent: Great, thank you. I've pulled up your order. I am initiating the return process now. You will receive an email shortly with a return shipping label and instructions on how to send the item back. Once we receive it, we will process a full refund.
Customer: That sounds perfect. Thank you for your help, Alex.
Agent: You're very welcome. Is there anything else I can assist you with today?
Customer: No, that's all.
Agent: Alright. Have a great day, Mr. Doe.
`;

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
  const [callDuration, setCallDuration] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeCallOutput | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [callDetails, setCallDetails] = useState({
      purpose: interaction.purpose || '',
      discussion: interaction.discussion || '',
      output: interaction.output || '',
      nextAction: interaction.nextAction || '',
  });

  useEffect(() => {
    setHydrated(true);
    let timer: NodeJS.Timeout;
    if (interaction.isLive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interaction.isLive]);

  const handleEndCall = () => {
    if (onCallEnd) {
      const durationStr = formatDuration(callDuration);
      onCallEnd({
        ...interaction,
        isLive: false,
        duration: durationStr,
        content: callDetails.purpose || `Call (duration: ${durationStr})`,
        transcript: mockTranscript,
        purpose: callDetails.purpose,
        discussion: callDetails.discussion,
        output: callDetails.output,
        nextAction: callDetails.nextAction,
      });
    }
  };

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

  const formatDuration = (seconds: number) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      const time = date.toISOString().substr(14, 5);
      return time === '00:00' && seconds > 0 ? '0m 0s' : time;
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
             {isCall && interaction.isLive && (
                <div className="mb-4 space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                            <Badge variant={'default'}>
                                <Phone className="mr-2 h-4 w-4 animate-pulse"/>
                                Calling
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                        </div>
                        <Button variant="destructive" size="sm" onClick={handleEndCall}>
                            <PhoneOff className="mr-2 h-4 w-4"/>
                            End Call
                        </Button>
                    </div>
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
                </div>
            )}
            
            {!interaction.isLive && (
                <p className="text-sm">{interaction.content}</p>
            )}

            {isCall && !interaction.isLive && interaction.transcript && (
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
          {isCall && !interaction.isLive && interaction.duration && (
             <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                Call Duration: {interaction.duration}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
