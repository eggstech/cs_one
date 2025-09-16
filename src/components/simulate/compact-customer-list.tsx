
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { customers } from '@/lib/data';
import { Customer } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';


interface CompactCustomerListProps {
    onSelectCustomer: (customerId: string) => void;
}

export function CompactCustomerList({ onSelectCustomer }: CompactCustomerListProps) {
  const [query, setQuery] = useState('');
  const filteredCustomers = query 
    ? customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)) 
    : customers;

  return (
    <div className='flex flex-col h-full'>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search customers..." 
                className="pl-9" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
        </div>
        <ScrollArea className='flex-1 pr-4 -mr-4'>
            <div className="space-y-2">
            {filteredCustomers.map(customer => (
                <div 
                    key={customer.id} 
                    onClick={() => onSelectCustomer(customer.id)} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
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
        </ScrollArea>
    </div>
  );
}
