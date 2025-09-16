
'use client';
import { CompactCustomerList } from './compact-customer-list';
import { CompactCustomerDetail } from './compact-customer-detail';
import { SidebarView } from '@/app/simulate/page';
import { useState } from 'react';
import { CompactTicketDetail } from './compact-ticket-detail';

interface CompactAppSidebarProps {
  view: SidebarView;
  onSetView: (view: SidebarView) => void;
  isWide?: boolean;
}

export function CompactAppSidebar({ view, onSetView, isWide }: CompactAppSidebarProps) {
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

    const handleBackToCustomer = () => {
        setTicketId(null);
    }

    if (ticketId && view.type === 'customerDetail') {
        return (
            <CompactTicketDetail 
                ticketId={ticketId}
                onBack={handleBackToCustomer}
                isWide={isWide}
            />
        )
    }

  switch (view.type) {
    case 'customerList':
      return <CompactCustomerList onSelectCustomer={handleSelectCustomer} />;
    case 'customerDetail':
      return (
        <CompactCustomerDetail
          customerId={view.customerId}
          isWide={isWide}
          onBack={handleBackToCustomerList}
          onSelectTicket={handleSelectTicket}
        />
      );
    default:
      return <CompactCustomerList onSelectCustomer={handleSelectCustomer} />;
  }
}
