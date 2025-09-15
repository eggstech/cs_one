
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
import { format } from "date-fns";
import {
  ArrowLeft,
  Send,
  StickyNote,
  Mail,
  MessageSquare,
  Phone,
  Facebook,
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

const interactionChannels = [
    { value: 'Note', label: 'Internal Note', icon: StickyNote },
    { value: 'Phone', label: 'Phone Call', icon: Phone },
    { value: 'Email', label: 'Email', icon: Mail },
    { value: 'Facebook', label: 'Facebook Message', icon: Icons.facebook },
    { value: 'Zalo', label: 'Zalo Chat', icon: Icons.zalo },
] as const;

type InteractionChannel = typeof interactionChannels[number]['value'];

export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const isCallActive = searchParams.get('call') === 'true';

  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  
  // State for new interaction form
  const [interactionChannel, setInteractionChannel] = useState<InteractionChannel>('Note');
  const [interactionContent, setInteractionContent] = useState("");
  const [callDetails, setCallDetails] = useState({
      startTime: '',
      endTime: '',
      purpose: '',
      discussion: '',
      output: '',
      nextAction: '',
      transcript: ''
  });

  const { ticketId } = params;

  useEffect(() => {
    const foundTicket = getTicket(ticketId);
    if (foundTicket) {
        if(isCallActive && !foundTicket.interactions.some(i => i.id === 'int-call-active')) {
            const callInteraction: Interaction = {
                id: 'int-call-active',
                type: 'Call',
                channel: 'Phone',
                date: new Date().toISOString(),
                agent: allAgents[0],
                content: `Call with ${foundTicket.customerName}`,
                ticketId: foundTicket.id,
                isLive: true,
            };
            setTicket({ ...foundTicket, interactions: [callInteraction, ...foundTicket.interactions]});
        } else {
            setTicket(foundTicket);
        }
    } else {
        notFound();
    }
  }, [ticketId, isCallActive]);
  
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
    if (!ticket) return;

    let newInteraction: Interaction | null = null;
    const baseInteraction = {
        id: `int-${Date.now()}`,
        date: new Date().toISOString(),
        agent: agents[0], // Assuming current user is agent-1
        ticketId: ticket.id,
    };

    if (interactionChannel === 'Call') {
        if (!callDetails.purpose || !callDetails.discussion) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all call details."});
            return;
        }
        newInteraction = {
            ...baseInteraction,
            type: 'Call',
            channel: 'Phone',
            content: callDetails.purpose,
            ...callDetails,
            duration: callDetails.startTime && callDetails.endTime ? `${(new Date(callDetails.endTime).getTime() - new Date(callDetails.startTime).getTime()) / 1000 / 60}m` : undefined,
        };
    } else {
        if (interactionContent.trim() === "") {
            toast({ variant: "destructive", title: "Cannot add empty reply", description: "Please enter some content."});
            return;
        }
        newInteraction = {
            ...baseInteraction,
            type: interactionChannel === 'Note' ? 'Note' : 'Chat',
            channel: interactionChannel,
            content: interactionContent,
        };
    }
    
    setTicket(prevTicket => prevTicket ? { ...prevTicket, interactions: [newInteraction!, ...prevTicket.interactions], updatedAt: new Date().toISOString() } : undefined);
    
    // Reset form
    setInteractionContent("");
    setCallDetails({ startTime: '', endTime: '', purpose: '', discussion: '', output: '', nextAction: '', transcript: '' });

    toast({
        title: `Interaction Added`,
        description: `Your ${interactionChannel} has been logged in the timeline.`,
    })
  };

  const onCallEnd = (callInteraction: Interaction) => {
      setTicket(prevTicket => {
          if (!prevTicket) return;
          const updatedInteractions = prevTicket.interactions.map(i => i.id === callInteraction.id ? callInteraction : i);
          return { ...prevTicket, interactions: updatedInteractions };
      });
  };

  const renderInteractionForm = () => {
      if (interactionChannel === 'Call') {
          return (
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="call-start">Start Time</Label>
                          <Input id="call-start" type="datetime-local" value={callDetails.startTime} onChange={e => setCallDetails({...callDetails, startTime: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="call-end">End Time</Label>
                          <Input id="call-end" type="datetime-local" value={callDetails.endTime} onChange={e => setCallDetails({...callDetails, endTime: e.target.value})} />
                      </div>
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
                   <div className="space-y-2">
                      <Label htmlFor="call-transcript">Transcript</Label>
                      <Textarea id="call-transcript" placeholder="Paste or type the call transcript here..." className="min-h-32" value={callDetails.transcript} onChange={e => setCallDetails({...callDetails, transcript: e.target.value})} />
                  </div>
              </div>
          )
      }

      // Default for Note, Email, Chat, etc.
      return (
          <div className="space-y-4">
              <Label htmlFor="new-interaction-content" className="text-sm font-medium">
                  {interactionChannel === 'Note' ? 'Internal Note' : `${interactionChannel} Message`}
              </Label>
              <Textarea
                id="new-interaction-content"
                placeholder={
                    interactionChannel === 'Note' ? "Add an internal note for your team..." :
                    `Type your ${interactionChannel} message here...`
                }
                value={interactionContent}
                onChange={(e) => setInteractionContent(e.target.value)}
                className="min-h-24"
              />
          </div>
      );
  }

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
           <Card>
                <CardHeader>
                    <CardTitle>Log Interaction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="interaction-channel">Channel</Label>
                        <Select value={interactionChannel} onValueChange={(value: InteractionChannel) => setInteractionChannel(value)}>
                            <SelectTrigger id="interaction-channel" className="w-[240px]">
                                <SelectValue placeholder="Select a channel" />
                            </SelectTrigger>
                            <SelectContent>
                                {interactionChannels.map(channel => (
                                    <SelectItem key={channel.value} value={channel.value}>
                                        <div className="flex items-center gap-2">
                                            <channel.icon className="h-4 w-4" />
                                            {channel.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {renderInteractionForm()}
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleAddReply}>
                        <Send className="mr-2 h-4 w-4" />
                        Add Interaction
                    </Button>
                </CardFooter>
            </Card>

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
                    onCallEnd={onCallEnd}
                  />
                ))}
              </div>
            </CardContent>
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

    