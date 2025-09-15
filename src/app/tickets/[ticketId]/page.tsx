'use client';

import { useState, useEffect, use } from "react";
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
import { useToast } from "@/hooks/use-toast";

export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const isCallActive = searchParams.get('call') === 'true';

  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [newInteractionContent, setNewInteractionContent] = useState("");
  const [replyType, setReplyType] = useState<'Note' | 'Email' | 'Chat'>('Note');
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
    if (!ticket || newInteractionContent.trim() === "") {
        toast({
            variant: "destructive",
            title: "Cannot add empty reply",
            description: "Please enter some content before sending.",
        })
        return;
    }
    
    const newInteraction: Interaction = {
        id: `int-${Date.now()}`,
        type: replyType,
        channel: replyType === 'Note' ? 'System' : replyType === 'Email' ? 'Email' : 'Chat', // Simplified for now
        date: new Date().toISOString(),
        agent: agents[0], // Assuming the current user is agent-1
        content: newInteractionContent,
        ticketId: ticket.id,
    };
    
    setTicket(prevTicket => prevTicket ? { ...prevTicket, interactions: [newInteraction, ...prevTicket.interactions], updatedAt: new Date().toISOString() } : undefined);
    setNewInteractionContent("");
    toast({
        title: `${replyType} added`,
        description: `Your ${replyType.toLowerCase()} has been added to the timeline.`,
    })
  };

  const onCallEnd = (callInteraction: Interaction) => {
      setTicket(prevTicket => {
          if (!prevTicket) return;
          const updatedInteractions = prevTicket.interactions.map(i => i.id === callInteraction.id ? callInteraction : i);
          return { ...prevTicket, interactions: updatedInteractions };
      });
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
          <Card>
            <CardContent className="p-6">
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
                            value={newInteractionContent}
                            onChange={(e) => setNewInteractionContent(e.target.value)}
                            className="min-h-24"
                          />
                      </div>
                  </TabsContent>
                  <TabsContent value="email" className="mt-4">
                      <div className="space-y-4">
                          <Input defaultValue={`Re: ${ticket.subject}`} placeholder="Subject"/>
                          <Textarea 
                            placeholder="Compose your email reply..." 
                            value={newInteractionContent}
                            onChange={(e) => setNewInteractionContent(e.target.value)}
                            className="min-h-40"
                          />
                      </div>
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4">
                      <div className="space-y-4">
                          <Textarea 
                            placeholder="Type your chat message..." 
                            value={newInteractionContent}
                            onChange={(e) => setNewInteractionContent(e.target.value)}
                            className="min-h-24"
                          />
                      </div>
                  </TabsContent>
              </Tabs>
              <div className="w-full flex justify-end mt-4">
                  <Button onClick={handleAddReply}>
                      <Send className="mr-2 h-4 w-4" />
                      Send {replyType}
                  </Button>
              </div>
            </CardContent>
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
