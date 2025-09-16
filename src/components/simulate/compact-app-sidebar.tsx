
'use client';
import { CompactCustomerList } from './compact-customer-list';
import { CompactCustomerDetail } from './compact-customer-detail';
import { SidebarView } from '@/app/simulate/page';
import { useState } from 'react';
import { CompactTicketDetail } from './compact-ticket-detail';
import { CompactTicketList } from './compact-ticket-list';
import { CompactCallHistoryList } from './compact-call-history-list';

interface CompactAppSidebarProps {
  activeTab: string;
  view: SidebarView;
  onSetView: (view: SidebarView) => void;
  isWide?: boolean;
}

export function CompactAppSidebar({ activeTab, view, onSetView, isWide }: CompactAppSidebarProps) {
    const [ticketId, setTicketId] = useState<string | null>(null);

    const handleSelectCustomer = (customerId: string) => {
        onSetView({ type: 'customerDetail', customerId });
    };

    const handleBackToCustomerList = () => {
        onSetView({ type: 'customerList' });
    };

    const handleSelectTicket = (selectedTicketId: string) => {
        setTicketId(selectedTicketId);
    };
    
    const handleBackToPreviousView = () => {
        setTicketId(null);
        // This is a simple back navigation. For a real app, you might need a more robust history stack.
        if (activeTab === 'customers') {
           if (view.type === 'customerDetail') {
               onSetView({ type: 'customerList' });
           }
        }
    }

    if (ticketId) {
        return (
            <CompactTicketDetail 
                ticketId={ticketId}
                onBack={handleBackToPreviousView}
                isWide={isWide}
            />
        )
    }
    
    switch (activeTab) {
        case 'customers':
            if (view.type === 'customerDetail') {
                return (
                    <CompactCustomerDetail
                        customerId={view.customerId}
                        isWide={isWide}
                        onBack={handleBackToCustomerList}
                        onSelectTicket={handleSelectTicket}
                    />
                );
            }
            return <CompactCustomerList onSelectCustomer={handleSelectCustomer} />;
        case 'tickets':
            return <CompactTicketList onSelectTicket={handleSelectTicket} />;
        case 'calls':
            return <CompactCallHistoryList onSelectCustomer={handleSelectCustomer}/>;
        default:
            return <CompactCustomerList onSelectCustomer={handleSelectCustomer} />;
    }
}
