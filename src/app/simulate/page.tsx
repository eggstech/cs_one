
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
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { customers } from '@/lib/data';
import { ScreenPop } from '@/components/screen-pop';
import { Customer } from '@/lib/types';
import { CompactAppSidebar } from '@/components/simulate/compact-app-sidebar';
import { cn } from '@/lib/utils';

export type SidebarView = 
    | { type: 'customerList' }
    | { type: 'customerDetail', customerId: string };

export default function SimulatePage() {
  const [isScreenPopVisible, setScreenPopVisible] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer>(customers[0]);
  const [isSidebarWide, setIsSidebarWide] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>({ type: 'customerList' });
  
  const handleSimulateCall = (customer: Customer) => {
    setActiveCustomer(customer);
    setScreenPopVisible(true);
    // When a call comes in, show that customer in the sidebar
    setSidebarView({ type: 'customerDetail', customerId: customer.id });
  };

  return (
    <>
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 pt-6">
      {/* Left Column: Simulation Controls */}
      <div className="lg:col-span-2 space-y-6">
         <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold tracking-tight">Simulate</h1>
            <p className="text-muted-foreground">
                Test and preview various platform integrations and tools.
            </p>
            </div>
             <Button variant="outline" size="sm" onClick={() => setIsSidebarWide(!isSidebarWide)}>
                {isSidebarWide ? <PanelRightClose className="mr-2 h-4 w-4"/> : <PanelRightOpen className="mr-2 h-4 w-4" />}
                Toggle Sidebar Size
            </Button>
        </div>
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
               <Button variant="outline" onClick={() => handleSimulateCall(customers[customers.length - 1])} className="w-full">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Simulate Unknown Caller
              </Button>
            </CardContent>
          </Card>
      </div>
      
      {/* Right Column: Simulated Sidebar/Extension */}
      <div className={cn(
          "flex flex-col space-y-4 transition-all duration-300",
          isSidebarWide ? "lg:col-span-1" : "lg:col-span-1"
        )}>
         <Card className="flex-1">
            <CardContent className="h-full">
              <CompactAppSidebar 
                view={sidebarView}
                onSetView={setSidebarView}
                isWide={isSidebarWide}
              />
            </CardContent>
          </Card>
      </div>

    </div>
      <ScreenPop
        customer={activeCustomer}
        open={isScreenPopVisible}
        onOpenChange={setScreenPopVisible}
      />
    </>
  );
}
