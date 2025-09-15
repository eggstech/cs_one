'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PhoneIncoming,
  MessageSquare,
} from 'lucide-react';
import { customers } from '@/lib/data';
import { ScreenPop } from '@/components/screen-pop';
import { PancakeWidget } from '@/components/pancake-widget';
import { Customer } from '@/lib/types';

export default function SimulatePage() {
  const [isScreenPopVisible, setScreenPopVisible] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer>(customers[0]);
  
  const handleSimulateCall = (customer: Customer) => {
    setActiveCustomer(customer);
    setScreenPopVisible(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulate</h1>
          <p className="text-muted-foreground">
            Test and preview various platform integrations and tools.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Simulations</CardTitle>
              <CardDescription>
                Trigger a screen pop for different caller types.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button onClick={() => handleSimulateCall(customers[0])} className="w-full">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Simulate Known Caller
              </Button>
               <Button variant="outline" onClick={() => handleSimulateCall(customers[2])} className="w-full">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Simulate Unknown Caller
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Pancake Chat Widget
              </CardTitle>
              <CardDescription>
                Live preview of the smart widget integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PancakeWidget customer={customers[0]} />
            </CardContent>
          </Card>
        </div>
      </div>
      <ScreenPop
        customer={activeCustomer}
        open={isScreenPopVisible}
        onOpenChange={setScreenPopVisible}
      />
    </div>
  );
}
