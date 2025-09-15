'use client';

import { useState, useEffect } from "react";
import { getTicket, getCustomer, agents as allAgents } from "@/lib/data";
import { notFound, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceStrict } from "date-fns";
import {
  ArrowLeft,
  Send,
  StickyNote,
  Mail,
  MessageSquare,
  Phone,
  PhoneOff,
  RefreshCw,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { InteractionTimelineItem } from "@/components/customers/interaction-timeline-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Interaction, Ticket } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { summarizeCall, SummarizeCallOutput } from "@/ai/flows/summarize-call";

const mockAudioDataUri = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAABoR2tGYUdQTk9JREdJS1BNSk9KTEpJR1BNSkpJSUpFREdDRURDQ0VBRlVORVVNT1VORVZVT0dFR0VDRUNFUERDQ0VDRUVERUdFRUVER0dGRUVFR0VFRUVFR0dFRUZHSEdIR0hISUdJSElIR0hIR0hISElISEhGRUdGRUZFRkVERERDQ0RCREJDP/7QMQ PAFVmYQPAAEAAAAPAAAEgAAAAAund2R2d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d//sA4gAAAAAAAwAABpFraWtpampoaGdnZ2ZlZWVlZGRkZGNjY2NjY2JiYmFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFiY2NjY2RkZGRlZWVmZmdnZ2hoaGlpaWlqampqa2tsbW1ubm9wcHFyc3N0dXV2dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tbW3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=";

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


export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const { ticketId } = params;
  const searchParams = useSearchParams();
  const isCallActive = searchParams.get('call') === 'true';

  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [newNote, setNewNote] = useState("");
  const [replyType, setReplyType] = useState<'Note' | 'Email' | 'Chat'>('Note');
  
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ended'>(isCallActive ? 'calling' : 'idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeCallOutput | null>(null);

  useEffect(() => {
    const foundTicket = getTicket(ticketId);
    if (foundTicket) {
        setTicket(foundTicket);
    } else {
        notFound();
    }
  }, [ticketId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'calling') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);
  
  const customer = ticket ? getCustomer(ticket.customerId) : undefined;
  const agents = allAgents;
  
  if (!ticket) {
    return <div className="flex-1 space-y-4 p-8 pt-6">Loading ticket details...</div>;
  }

  const handleStatusChange = (status: Ticket['status']) => {
    setTicket(prevTicket => prevTicket ? { ...prevTicket, status, updatedAt: new Date().toISOString() } : undefined);
  };
  
  const handleAgentChange = (agentId: string) => {
    const newAgent = agents.find(a => a.id === agentId);
    if (newAgent) {
      setTicket(prevTicket => prevTicket ? { ...prevTicket, agent: newAgent, updatedAt: new Date().toISOString() } : undefined);
    }
  };
  
  const handleAddReply = () => {
    if (!ticket || newNote.trim() === "") return;
    
    const newInteraction: Interaction = {
        id: `int-${Date.now()}`,
        type: replyType,
        channel: replyType === 'Note' ? 'System' : 'Email', // Simplified for now
        date: new Date().toISOString(),
        agent: agents[0], // Assuming the current user is agent-1
        content: newNote,
        ticketId: ticket.id,
    };
    
    setTicket(prevTicket => prevTicket ? { ...prevTicket, interactions: [newInteraction, ...prevTicket.interactions], updatedAt: new Date().toISOString() } : undefined);
    setNewNote("");
  };

  const handleSummarize = async () => {
      setIsSummarizing(true);
      setSummary(null);
      try {
          const result = await summarizeCall({ audioDataUri: mockAudioDataUri });
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
      return date.toISOString().substr(14, 5);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tickets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ticket <span className="font-mono text-primary">{ticket.id}</span>
          </h1>
          <p className="text-muted-foreground">{ticket.subject}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">

          {callStatus !== 'idle' && (
            <Card>
                <CardHeader>
                    <CardTitle>Call Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <Badge variant={callStatus === 'calling' ? 'default' : 'secondary'}>
                                {callStatus === 'calling' && <Phone className="mr-2 h-4 w-4 animate-pulse"/>}
                                {callStatus === 'ended' && <PhoneOff className="mr-2 h-4 w-4"/>}
                                {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
                           </Badge>
                           <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {callStatus === 'calling' ? (
                                <Button variant="destructive" onClick={() => setCallStatus('ended')}>
                                    <PhoneOff className="mr-2 h-4 w-4"/>
                                    End Call
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={() => { setCallStatus('calling'); setCallDuration(0)}}>
                                    <RefreshCw className="mr-2 h-4 w-4"/>
                                    Recall
                                </Button>
                            )}
                        </div>
                    </div>
                    {callStatus === 'ended' && (
                       <div className="space-y-4">
                            <div>
                                <Label htmlFor="transcript" className="font-semibold">Transcript</Label>
                                <Textarea id="transcript" readOnly value={mockTranscript} className="mt-2 min-h-48 font-mono text-xs" />
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
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ticket.interactions.map((interaction) => (
                  <InteractionTimelineItem
                    key={interaction.id}
                    interaction={interaction}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 border-t pt-6">
                <Tabs defaultValue="note" className="w-full" onValueChange={(value) => setReplyType(value as any)}>
                    <TabsList>
                        <TabsTrigger value="note"><StickyNote className="mr-2 h-4 w-4" />Add Note</TabsTrigger>
                        <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />Send Email</TabsTrigger>
                        <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Send Chat</TabsTrigger>
                    </TabsList>
                    <TabsContent value="note" className="mt-4">
                        <div className="space-y-4">
                           <Label htmlFor="new-note" className="text-sm font-medium">Internal Note</Label>
                            <Textarea 
                              id="new-note" 
                              placeholder="Add an internal note for your team..." 
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              className="min-h-24"
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="email" className="mt-4">
                        <div className="space-y-4">
                            <Input defaultValue={`Re: ${ticket.subject}`} placeholder="Subject"/>
                            <Textarea 
                              placeholder="Compose your email reply..." 
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              className="min-h-40"
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="chat" className="mt-4">
                        <div className="space-y-4">
                           <Textarea 
                              placeholder="Type your chat message..." 
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              className="min-h-24"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="w-full flex justify-end mt-4">
                    <Button onClick={handleAddReply}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </div>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Agent</span>
                 <Select value={ticket.agent.id} onValueChange={handleAgentChange}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <Separator />
               <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{format(new Date(ticket.createdAt), "PPpp")}</span>
              </div>
               <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-medium">{format(new Date(ticket.updatedAt), "PPpp")}</span>
              </div>
            </CardContent>
          </Card>
          {customer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/customers/${customer.id}`}>
                  <div className="flex items-center gap-3 group">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold group-hover:underline">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
