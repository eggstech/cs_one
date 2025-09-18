

'use client';

import { useState, useEffect, Suspense } from "react";
import { getTicket, getCustomer, agents as allAgents, interactions as allInteractions } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNowStrict, isAfter } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { InteractionTimeline } from "@/components/customers/interaction-timeline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Interaction, Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";

const SlaInfo = ({ sla }: { sla: Ticket['sla'] }) => {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => { setHydrated(true) }, []);
    
    if (!hydrated || !sla) return null;

    const dueDate = new Date(sla.resolutionDue);
    const now = new Date();
    const isOverdue = isAfter(now, dueDate);
    const distance = formatDistanceToNowStrict(dueDate, { addSuffix: true });
    
    const statusColor = 
        sla.status === 'Breached' ? 'text-destructive' :
        sla.status === 'At Risk' ? 'text-yellow-600' :
        'text-green-600';
    
    return (
        <>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">SLA Status</span>
                <span className={cn("font-bold", statusColor)}>{sla.status}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> Due Time</span>
                <span className={cn("font-medium", statusColor)}>
                    {isOverdue ? `Overdue by ${distance}` : distance}
                </span>
            </div>
        </>
    )
}

function TicketDetailClient({ ticketId }: { ticketId: string }) {
  const searchParams = useSearchParams();
  const isCallActive = searchParams.get('call') === 'true';

  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let foundTicket = getTicket(ticketId);
    if (foundTicket) {
        const ticketInteractions = allInteractions
            .filter(i => i.ticketId === ticketId)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        foundTicket = { ...foundTicket, interactions: ticketInteractions };

        if(isCallActive && !foundTicket.interactions.some(i => i.isLive)) {
            const callInteraction: Interaction = {
                id: `int-call-active-${Date.now()}`,
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
    } else if (ticketId === 'TKT-007' && isCallActive) {
      const newTicket: Ticket = {
        id: 'TKT-007',
        customerId: searchParams.get('customerId') || 'cus-1',
        customerName: 'John Doe',
        customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
        subject: searchParams.get('subject') || 'Phone Call',
        status: 'New',
        agent: allAgents[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        interactions: [
          {
            id: 'int-call-active',
            type: 'Call',
            channel: 'Phone',
            date: new Date().toISOString(),
            agent: allAgents[0],
            content: `Call with John Doe`,
            ticketId: 'TKT-007',
            isLive: true,
          }
        ],
      };
      setTicket(newTicket);
    }
    setHydrated(true);
  }, [ticketId, isCallActive, searchParams]);
  
  const customer = ticket ? getCustomer(ticket.customerId) : undefined;
  const agents = allAgents;

  useEffect(() => {
    if (hydrated && !ticket) {
      // This will trigger notFound if the ticket is not found after initial hydration.
      const foundTicket = getTicket(ticketId);
      if(!foundTicket && !(ticketId === 'TKT-007' && isCallActive)) {
         // Silently fail for now, ideally show a not found page.
         console.error("Ticket not found");
      }
    }
  }, [ticketId, ticket, hydrated, isCallActive]);

  if (!hydrated || !ticket) {
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

  const handleAddInteraction = (interaction: Omit<Interaction, 'id' | 'date' | 'agent'>) => {
     setTicket(prevTicket => {
        if (!prevTicket) return;
        const newInteraction: Interaction = {
          id: `int-${Date.now()}`,
          date: new Date().toISOString(),
          agent: allAgents[0],
          ...interaction,
        };
        return { ...prevTicket, interactions: [newInteraction, ...prevTicket.interactions] };
     })
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
          <InteractionTimeline interactions={ticket.interactions} onAddInteraction={handleAddInteraction} isCallActive={isCallActive} />
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
                <span className="font-medium">{hydrated ? format(new Date(ticket.createdAt), "PPpp") : ""}</span>
              </div>
               <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-medium">{hydrated ? format(new Date(ticket.updatedAt), "PPpp") : ""}</span>
              </div>
              <SlaInfo sla={ticket.sla} />
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


export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const { ticketId } = params;

  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <TicketDetailClient ticketId={ticketId} />
    </Suspense>
  )
}
