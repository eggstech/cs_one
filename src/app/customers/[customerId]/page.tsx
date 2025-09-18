
'use client';
import { getCustomer, getTicketsForCustomer, agents } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Tag, Trophy, Phone } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LinkedIdentities } from "@/components/customers/linked-identities";
import { OrderHistory } from "@/components/customers/order-history";
import { EyeMeasurementCard } from "@/components/customers/eye-measurement-card";
import { InteractionTimeline } from "@/components/customers/interaction-timeline";
import { Badge } from "@/components/ui/badge";
import { TicketHistory } from "@/components/customers/ticket-history";
import { DebtHistoryCard } from "@/components/customers/debt-history-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, Suspense } from 'react';
import { Customer, Interaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { EditCustomerProfileDialog } from "@/components/customers/edit-customer-profile-dialog";
import { Loader2 } from "lucide-react";

function CustomerProfileClient({ customerId }: { customerId: string }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const isCallActive = searchParams.get('call') === 'true';

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchedCustomer = getCustomer(customerId);
    setCustomer(fetchedCustomer);
    setHydrated(true);
  }, [customerId]);

  if (!hydrated || !customer) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="h-64 w-full animate-pulse rounded-lg bg-muted"></div>
            <div className="h-48 w-full animate-pulse rounded-lg bg-muted"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 w-full animate-pulse rounded-lg bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddInteraction = (interactionData: Omit<Interaction, 'id' | 'date' | 'agent'>) => {
    if (!customer) return;

    const newInteraction: Interaction = {
      id: `int-${Date.now()}`,
      date: new Date().toISOString(),
      agent: agents[0], // Assuming current user is agent-0
      ...interactionData,
    };
    
    setCustomer(prevCustomer => prevCustomer ? { ...prevCustomer, interactions: [newInteraction, ...prevCustomer.interactions] } : undefined);

    toast({
      title: `Interaction Added`,
      description: `Your ${interactionData.channel} interaction has been logged.`,
    });
  };

  const handleUpdateCustomer = (updatedData: Partial<Customer>) => {
    if (!customer) return;
    setCustomer(prevCustomer => prevCustomer ? { ...prevCustomer, ...updatedData } : undefined);
    toast({
      title: "Profile Updated",
      description: "Customer details have been successfully updated.",
    });
    setIsEditDialogOpen(false);
  }

  const customerTickets = getTicketsForCustomer(customerId);

  const levelColors: { [key: string]: string } = {
    Bronze: "text-[#cd7f32]",
    Silver: "text-slate-400",
    Gold: "text-yellow-500",
  }

  const callLink = `/customers/${customer.id}?call=true`;

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" aria-label="Back to dashboard" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person face" />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column (Details) */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phone</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{customer.phone}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <Link href={callLink}>
                        <Phone className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
                {customer.membership && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Trophy className={`size-4 ${levelColors[customer.membership.level]}`} />
                        Membership
                      </span>
                      <span className={`font-bold ${levelColors[customer.membership.level]}`}>{customer.membership.level}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <span className="text-muted-foreground flex items-center gap-2 mb-2"><Tag className="size-4" /> Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <LinkedIdentities identities={customer.identities} />
          </div>
          
          {/* Right Column (Tabs) */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="space-y-6">
                <InteractionTimeline 
                  interactions={customer.interactions} 
                  onAddInteraction={handleAddInteraction} 
                  isCallActive={isCallActive}
                 />
              </TabsContent>
              
              <TabsContent value="tickets">
                <TicketHistory tickets={customerTickets} />
              </TabsContent>
              
              <TabsContent value="orders">
                <OrderHistory orders={customer.orders} />
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                {customer.eyeMeasurement && <EyeMeasurementCard measurement={customer.eyeMeasurement} />}
                {customer.debt && <DebtHistoryCard debt={customer.debt} />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <EditCustomerProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customer}
        onSave={handleUpdateCustomer}
      />
    </>
  );
}

export default function CustomerProfilePage({ params }: { params: { customerId: string } }) {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <CustomerProfileClient customerId={params.customerId} />
    </Suspense>
  )
}
