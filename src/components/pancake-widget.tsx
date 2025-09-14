import { Customer } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Phone, Mail, ShoppingBag } from 'lucide-react';

interface PancakeWidgetProps {
  customer: Customer;
}

export function PancakeWidget({ customer }: PancakeWidgetProps) {
  const latestOrder = customer.orders.length > 0 ? customer.orders[0] : null;
  return (
    <Card className="bg-background/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person face" />
            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{customer.name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="size-3" /> {customer.phone}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <ShoppingBag className="size-3.5" /> Recent Order
            </h4>
            {latestOrder ? (
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-foreground">{latestOrder.id}</span>
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
      </CardContent>
    </Card>
  );
}
