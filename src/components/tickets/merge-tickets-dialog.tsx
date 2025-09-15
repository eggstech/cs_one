'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, GitMerge, X } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function TicketSearch({ onSelectTicket, excludedId, title }: { onSelectTicket: (ticket: Ticket) => void, excludedId?: string, title: string }) {
  const [query, setQuery] = useState('');
  const filteredTickets = query 
    ? allTickets.filter(t => 
        (t.subject.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())) && t.id !== excludedId
      ) 
    : [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID or subject..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent className='overflow-y-auto'>
        <div className="space-y-2">
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

interface MergeTicketsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MergeTicketsDialog({ open, onOpenChange }: MergeTicketsDialogProps) {
  const [primaryTicket, setPrimaryTicket] = useState<Ticket | null>(null);
  const [sourceTicket, setSourceTicket] = useState<Ticket | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const handleMerge = () => {
    toast({
        title: "Tickets Merged",
        description: `Ticket ${sourceTicket?.id} has been successfully merged into ${primaryTicket?.id}.`,
    })
    setIsConfirming(false);
    setPrimaryTicket(null);
    setSourceTicket(null);
    onOpenChange(false);
  }

  const handleCancel = () => {
      setPrimaryTicket(null);
      setSourceTicket(null);
      onOpenChange(false);
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[70vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Merge Duplicate Tickets</DialogTitle>
                <DialogDescription>
                    Select a source ticket and a primary ticket. Interactions from the source will be moved to the primary, and the source ticket will be closed.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1 overflow-hidden">
                <div className='flex flex-col h-full'>
                    {primaryTicket ? <TicketDisplay ticket={primaryTicket} onClear={() => setPrimaryTicket(null)} isPrimary={true}/> : <TicketSearch title="Select Primary Ticket" onSelectTicket={setPrimaryTicket} excludedId={sourceTicket?.id} />}
                </div>
                <div className='flex flex-col h-full'>
                    {sourceTicket ? <TicketDisplay ticket={sourceTicket} onClear={() => setSourceTicket(null)} isPrimary={false} /> : <TicketSearch title="Select Source Ticket" onSelectTicket={setSourceTicket} excludedId={primaryTicket?.id} />}
                </div>
            </div>
             {primaryTicket && sourceTicket && primaryTicket.customerId !== sourceTicket.customerId && (
                <p className='text-center text-destructive text-sm'>Tickets must belong to the same customer to be merged.</p>
            )}
            <DialogFooter>
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button 
                    onClick={() => setIsConfirming(true)} 
                    disabled={!primaryTicket || !sourceTicket || primaryTicket.customerId !== sourceTicket.customerId}
                >
                    <GitMerge className="mr-2 h-5 w-5" />
                    Merge Tickets
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

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
