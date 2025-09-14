'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, GitMerge, Check, X } from 'lucide-react';
import { customers } from '@/lib/data';
import { Customer } from '@/lib/types';
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
} from "@/components/ui/alert-dialog"

function CustomerSearch({ onSelectCustomer }: { onSelectCustomer: (customer: Customer) => void }) {
  const [query, setQuery] = useState('');
  const filteredCustomers = query ? customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)) : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Find a Customer</CardTitle>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or phone..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCustomers.map(customer => (
            <div key={customer.id} onClick={() => onSelectCustomer(customer)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
              <Avatar>
                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileDisplay({ profile, onClear }: { profile: Customer | null, onClear: () => void }) {
  if (!profile) return <CustomerSearch onSelectCustomer={() => {}} />; // This should be handled better
  
  return (
    <Card>
      <CardHeader className="relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClear}>
            <X className="h-4 w-4"/>
        </Button>
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle>{profile.name}</CardTitle>
                <p className="text-muted-foreground">{profile.phone}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Interactions:</span> {profile.interactions.length}</p>
            <p><span className="font-semibold">Orders:</span> {profile.orders.length}</p>
            <div className="flex flex-wrap gap-1 pt-2">
                {profile.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MergeProfilesClient() {
  const [profile1, setProfile1] = useState<Customer | null>(null);
  const [profile2, setProfile2] = useState<Customer | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {profile1 ? <ProfileDisplay profile={profile1} onClear={() => setProfile1(null)} /> : <CustomerSearch onSelectCustomer={setProfile1} />}
      {profile2 ? <ProfileDisplay profile={profile2} onClear={() => setProfile2(null)} /> : <CustomerSearch onSelectCustomer={setProfile2} />}
    </div>
    {profile1 && profile2 && (
        <div className="flex justify-center mt-6">
            <Button size="lg" onClick={() => setIsConfirming(true)}>
                <GitMerge className="mr-2 h-5 w-5" />
                Merge Profiles
            </Button>
        </div>
    )}
    <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to merge these profiles?</AlertDialogTitle>
            <AlertDialogDescription>
                This will merge <span className="font-bold">{profile2?.name}</span> into <span className="font-bold">{profile1?.name}</span>. 
                All interactions and order history will be consolidated. The duplicate profile will be archived. This action cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                setProfile1(null);
                setProfile2(null);
            }}>Confirm Merge</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
