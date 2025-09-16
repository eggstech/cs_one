
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { customers } from '@/lib/data';
import { Interaction, Customer } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { CallDetailModal } from '@/components/call-history/call-detail-modal';

interface CallLog extends Interaction {
    customer: Customer;
}

export default function CallHistoryPage() {
    const [callLogs, setCallLogs] = useState<CallLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const allCalls = customers.flatMap(customer =>
            customer.interactions
                .filter(interaction => interaction.type === 'Call')
                .map(interaction => ({ ...interaction, customer }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCallLogs(allCalls);
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="h-12 w-1/3 animate-pulse rounded-lg bg-muted"></div>
                <div className="h-96 w-full animate-pulse rounded-lg bg-muted"></div>
            </div>
        )
    }

  return (
    <>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call History</h1>
          <p className="text-muted-foreground">
            A log of all past phone call interactions.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer">
                    <TableCell>
                        <Link href={`/customers/${log.customer.id}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={log.customer.avatarUrl}
                                alt={log.customer.name}
                            />
                            <AvatarFallback>
                                {log.customer.name.charAt(0)}
                            </AvatarFallback>
                            </Avatar>
                            <span className="font-medium hover:underline">{log.customer.name}</span>
                        </div>
                        </Link>
                    </TableCell>
                   <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={log.agent.avatarUrl} alt={log.agent.name} />
                        <AvatarFallback>{log.agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{log.agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(log.date), 'PPpp')}</TableCell>
                  <TableCell>{log.duration || '-'}</TableCell>
                  <TableCell>{log.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
     <CallDetailModal 
        interaction={selectedLog}
        open={!!selectedLog}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedLog(null);
            }
        }}
    />
    </>
  );
}
