import { getCustomer, getTicketsForCustomer } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Tag, Trophy } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LinkedIdentities } from "@/components/customers/linked-identities";
import { OrderHistory } from "@/components/customers/order-history";
import { EyeMeasurementCard } from "@/components/customers/eye-measurement-card";
import { InteractionTimeline } from "@/components/customers/interaction-timeline";
import { Badge } from "@/components/ui/badge";
import { TicketHistory } from "@/components/customers/ticket-history";
import { DebtHistoryCard } from "@/components/customers/debt-history-card";

export default function CustomerProfilePage({ params }: { params: { customerId: string } }) {
  const customer = getCustomer(params.customerId);

  if (!customer) {
    notFound();
  }

  const customerTickets = getTicketsForCustomer(params.customerId);

  const levelColors: { [key: string]: string } = {
    Bronze: "text-[#cd7f32]",
    Silver: "text-slate-400",
    Gold: "text-yellow-500",
  }

  return (
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
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Center Column (Main) */}
        <div className="lg:col-span-2 space-y-6">
          <InteractionTimeline interactions={customer.interactions} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{customer.phone}</span>
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
            
            {customer.eyeMeasurement && <EyeMeasurementCard measurement={customer.eyeMeasurement} />}

            <TicketHistory tickets={customerTickets} />
            <OrderHistory orders={customer.orders} />
            {customer.debt && <DebtHistoryCard debt={customer.debt} />}
        </div>
      </div>
    </div>
  );
}
