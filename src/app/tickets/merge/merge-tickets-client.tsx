'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, GitMerge, X, Ticket as TicketIcon } from 'lucide-react';
import { tickets as allTickets } from '@/lib/data';
import { Ticket } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

function TicketSearch({ onSelectTicket, excludedId }: { onSelectTicket: (ticket: Ticket) => void, excludedId?: string }) {
  const [query, setQuery] = useState('');
  const filteredTickets = query 
    ? allTickets.filter(t => 
        (t.subject.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())) && t.id !== excludedId
      ) 
    : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Find a Ticket</CardTitle>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID or subject..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} onClick={() => onSelectTicket(ticket)} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer">
              <div className='flex flex-col gap-1'>
                <p className="font-medium hover:underline">{ticket.subject}</p>
                <p className="text-sm text-muted-foreground font-mono">{ticket.id}</p>
              </div>
              <Badge variant={ticket.status === 'Closed' ? 'destructive' : 'secondary'}>{ticket.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TicketDisplay({ ticket, onClear, isPrimary }: { ticket: Ticket, onClear: () => void, isPrimary: boolean }) {
  return (
    <Card className={isPrimary ? 'border-primary border-2' : ''}>
      <CardHeader className="relative pb-2">
        {isPrimary && <Badge className='absolute top-2 left-2'>Primary</Badge>}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClear}>
            <X className="h-4 w-4"/>
        </Button>
        <CardTitle className='pt-6'>{ticket.subject}</CardTitle>
        <CardDescription className='font-mono'>{ticket.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Customer</span>
            <Link href={`/customers/${ticket.customerId}`} className="flex items-center gap-2 hover:underline">
              <Avatar className='h-6 w-6'>
                <AvatarImage src={ticket.customerAvatarUrl} />
                <AvatarFallback>{ticket.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{ticket.customerName}</span>
            </Link>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={ticket.status === 'Closed' ? 'destructive' : 'secondary'}>{ticket.status}</Badge>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Interactions</span>
            <span className="font-medium">{ticket.interactions.length}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MergeTicketsClient() {
  const [primaryTicket, setPrimaryTicket] = useState<Ticket | null>(null);
  const [sourceTicket, setSourceTicket] = useState<Ticket | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleMerge = () => {
    // In a real app, you'd call an API here to perform the merge
    console.log(`Merging ${sourceTicket?.id} into ${primaryTicket?.id}`);
    setIsConfirming(false);
    setPrimaryTicket(null);
    setSourceTicket(null);
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {primaryTicket ? <TicketDisplay ticket={primaryTicket} onClear={() => setPrimaryTicket(null)} isPrimary={true}/> : <TicketSearch onSelectTicket={setPrimaryTicket} excludedId={sourceTicket?.id} />}
      {sourceTicket ? <TicketDisplay ticket={sourceTicket} onClear={() => setSourceTicket(null)} isPrimary={false} /> : <TicketSearch onSelectTicket={setSourceTicket} excludedId={primaryTicket?.id} />}
    </div>
    {primaryTicket && sourceTicket && (
        <div className="flex justify-center mt-6">
            <Button size="lg" onClick={() => setIsConfirming(true)} disabled={primaryTicket.customerId !== sourceTicket.customerId}>
                <GitMerge className="mr-2 h-5 w-5" />
                Merge Tickets
            </Button>
        </div>
    )}
     {primaryTicket && sourceTicket && primaryTicket.customerId !== sourceTicket.customerId && (
        <p className='text-center text-destructive text-sm mt-2'>Tickets must belong to the same customer to be merged.</p>
    )}

    <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to merge these tickets?</AlertDialogTitle>
            <AlertDialogDescription>
                This will move all interactions from ticket <span className="font-bold font-mono">{sourceTicket?.id}</span> into <span className="font-bold font-mono">{primaryTicket?.id}</span>. 
                The source ticket will be closed. This action cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMerge}>Confirm Merge</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
