
import { Customer } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Phone, Mail, ShoppingBag } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CompactCustomerViewProps {
  customer: Customer;
  isWide?: boolean;
}

export function CompactCustomerView({ customer, isWide = false }: CompactCustomerViewProps) {
  const latestOrder = customer.orders.length > 0 ? customer.orders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const latestInteraction = customer.interactions.length > 0 ? customer.interactions[0] : null;

  return (
    <Card className="bg-background/50 border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className={cn(isWide ? "h-20 w-20" : "h-12 w-12")}>
            <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person face" />
            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className={cn("font-semibold text-foreground", isWide ? "text-xl" : "text-lg")}>{customer.name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="size-3" /> {customer.phone}</span>
            </div>
             {isWide && <p className="text-sm text-muted-foreground">{customer.email}</p>}
          </div>
        </div>

        {isWide && (
             <div className="flex flex-wrap gap-2">
                {customer.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                {customer.membership && <Badge variant="outline">{customer.membership.level} Member</Badge>}
            </div>
        )}
        
        <Separator />
        
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <ShoppingBag className="size-4" /> Recent Order
            </h4>
            {latestOrder ? (
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-foreground">{latestOrder.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{format(new Date(latestOrder.date), 'PP')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-foreground">{latestOrder.status}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium text-foreground">${latestOrder.total.toFixed(2)}</span>
                </div>
            </div>
            ) : (
                <p className="text-sm text-muted-foreground">No orders found.</p>
            )}
        </div>

        {isWide && latestInteraction && (
            <>
            <Separator />
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Last Interaction
                </h4>
                <div className="text-sm p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold">{latestInteraction.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {latestInteraction.type} via {latestInteraction.channel} with {latestInteraction.agent.name}
                    </p>
                </div>
            </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
