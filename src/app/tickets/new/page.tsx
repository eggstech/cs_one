'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { customers, agents } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';

const ticketCategories = ['Order', 'Staffs', 'Policy', 'Product', 'Other'];

export default function NewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const customerOptions = customers
    .filter(c => c.name !== 'Unrecognized Caller')
    .map(customer => ({
      value: customer.id,
      label: `${customer.name} - ${customer.phone}`
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !subject || !description || !category) {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill out all required fields.",
        });
        return;
    }
    // In a real app, you would submit this data to your backend
    // and create a new ticket. Here we just log it and redirect.
    console.log({
      customerId,
      agentId,
      subject,
      description,
      category,
    });
    
    toast({
        title: "Ticket Created",
        description: `New ticket "${subject}" has been successfully created.`,
    });

    router.push('/tickets');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tickets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Ticket</h1>
          <p className="text-muted-foreground">
            Fill in the details below to open a new support ticket.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              All fields marked with an asterisk (*) are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Combobox 
                    options={customerOptions}
                    value={customerId}
                    onChange={setCustomerId}
                    placeholder="Select a customer"
                    searchPlaceholder="Search customer by name or phone..."
                    emptyPlaceholder="No customer found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent">Assign to Agent</Label>
                <Select value={agentId} onValueChange={setAgentId}>
                  <SelectTrigger id="agent">
                    <SelectValue placeholder="Assign an agent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                        id="subject" 
                        placeholder="e.g., Issue with my recent order" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {ticketCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please describe the issue in detail..."
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/tickets">Cancel</Link>
            </Button>
            <Button type="submit">Create Ticket</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
