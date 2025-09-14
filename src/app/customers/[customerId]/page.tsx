import { getCustomer } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Tag } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LinkedIdentities } from "@/components/customers/linked-identities";
import { OrderHistory } from "@/components/customers/order-history";
import { EyeMeasurementCard } from "@/components/customers/eye-measurement-card";
import { InteractionTimeline } from "@/components/customers/interaction-timeline";
import { Badge } from "@/components/ui/badge";

export default function CustomerProfilePage({ params }: { params: { customerId: string } }) {
  const customer = getCustomer(params.customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" aria-label="Back to dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
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

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
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
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <InteractionTimeline interactions={customer.interactions} />
          <OrderHistory orders={customer.orders} />
        </div>
      </div>
    </div>
  );
}
