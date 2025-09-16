import { Customer, Ticket, Interaction, Order } from './types';

export const agents = [
  { id: 'agent-1', name: 'Alex Green', avatarUrl: 'https://picsum.photos/seed/101/40/40' },
  { id: 'agent-2', name: 'Brianna White', avatarUrl: 'https://picsum.photos/seed/102/40/40' },
  { id: 'agent-3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/103/40/40' },
];

export let tickets: Ticket[] = [];
export const getTicket = (id: string): Ticket | undefined => tickets.find(t => t.id === id);


const interactions: Interaction[] = [
  {
    id: 'int-1',
    type: 'Call',
    channel: 'Phone',
    callType: 'Incoming',
    date: '2024-07-22T14:30:00Z',
    duration: '5m 32s',
    agent: agents[0],
    recordingUrl: '#',
    summary: 'Initial inquiry about order status.',
    content: 'Customer called to ask about the shipping status of order #ORD-001.',
    ticketId: 'TKT-001'
  },
  {
    id: 'int-2',
    type: 'Ticket',
    channel: 'System',
    date: '2024-07-22T14:35:00Z',
    agent: agents[0],
    ticketId: 'TKT-001',
    content: 'Ticket TKT-001 created: "Order Status Inquiry".'
  },
  {
    id: 'int-3',
    type: 'Chat',
    channel: 'Facebook',
    date: '2024-07-23T10:00:00Z',
    agent: agents[1],
    content: 'Followed up via Facebook chat to provide tracking number. Customer seemed happy.',
    ticketId: 'TKT-001'
  },
  {
    id: 'int-4',
    type: 'Note',
    channel: 'System',
    date: '2024-07-23T10:05:00Z',
    agent: agents[1],
    content: 'Customer confirmed receipt of tracking number. Marked ticket as resolved.',
    ticketId: 'TKT-001'
  },
  {
    id: 'int-5',
    type: 'Ticket',
    channel: 'System',
    date: '2024-07-21T16:00:00Z',
    agent: agents[2],
    ticketId: 'TKT-002',
    content: 'Ticket TKT-002 created: "Issue with new prescription".'
  },
  {
    id: 'int-6',
    type: 'Note',
    channel: 'System',
    date: '2024-06-15T11:00:00Z',
    agent: agents[0],
    content: 'Customer called to update their prescription details. Updated Eye Measurement profile.'
  },
  {
    id: 'int-7',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-05-30T17:20:00Z',
    agent: agents[2],
    content: 'Customer asked about our return policy. Sent them a link to the FAQ page.'
  },
  {
    id: 'int-8',
    type: 'Call',
    callType: 'Incoming',
    channel: 'Phone',
    date: '2024-07-24T11:00:00Z',
    duration: '12m 15s',
    agent: agents[0],
    recordingUrl: '#',
    ticketId: 'TKT-003',
    content: 'Customer called to request a return for order ORD-001. Claims the frames are not as expected.'
  },
  {
    id: 'int-9',
    type: 'Note',
    channel: 'System',
    date: '2024-07-24T11:15:00Z',
    agent: agents[0],
    ticketId: 'TKT-003',
    content: 'Advised customer on the return process. Awaiting customer to ship the item back.'
  },
  {
    id: 'int-10',
    type: 'Ticket',
    channel: 'System',
    date: '2024-07-25T09:00:00Z',
    agent: agents[1],
    ticketId: 'TKT-004',
    content: 'Ticket TKT-004 created: "Question about lens coating".'
  },
  {
    id: 'int-11',
    type: 'Call',
    callType: 'Outgoing',
    channel: 'Phone',
    date: '2024-07-25T10:00:00Z',
    duration: '8m 45s',
    agent: agents[2],
    recordingUrl: '#',
    ticketId: 'TKT-005',
    content: 'Customer called about a cracked lens on a recent order.'
  },
  {
    id: 'int-12',
    type: 'Note',
    channel: 'System',
    date: '2024-07-25T10:08:00Z',
    agent: agents[2],
    ticketId: 'TKT-005',
    content: 'Ticket TKT-005 created: "Cracked lens on delivery". Advised customer we will ship a replacement.'
  },
  {
    id: 'int-13',
    type: 'Ticket',
    channel: 'System',
    date: '2024-07-20T10:00:00Z',
    agent: agents[0],
    ticketId: 'TKT-006',
    content: 'Ticket TKT-006 created: "Billing inquiry".'
  },
  {
    id: 'int-14',
    type: 'Note',
    channel: 'System',
    date: '2024-07-20T10:15:00Z',
    agent: agents[0],
    ticketId: 'TKT-006',
    content: 'Clarified the billing statement with the customer. Issue resolved.'
  },
  {
    id: 'int-15',
    type: 'Note',
    channel: 'System',
    date: '2024-07-21T11:00:00Z',
    agent: agents[0],
    ticketId: 'TKT-006',
    content: 'Ticket auto-closed after 24 hours of resolution.'
  },
  {
    id: 'int-16',
    type: 'Call',
    callType: 'Outgoing',
    channel: 'Phone',
    date: '2024-07-26T10:00:00Z',
    duration: '2m 30s',
    agent: agents[0],
    ticketId: 'TKT-007',
    content: 'Initiated call to discuss return of ORD-001.'
  },
  {
    id: 'int-17',
    type: 'Call',
    callType: 'Missed',
    channel: 'Phone',
    date: '2024-07-26T12:00:00Z',
    agent: agents[1],
    content: 'Missed call from customer.'
  },
  {
    id: 'int-18',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-15T11:00:00Z',
    agent: agents[1],
    content: 'Customer inquired about store opening hours.',
    ticketId: 'TKT-008'
  },
  {
    id: 'int-19',
    type: 'Note',
    channel: 'System',
    date: '2024-07-15T11:05:00Z',
    agent: agents[1],
    content: 'Provided store hours and location link.',
    ticketId: 'TKT-008'
  },
  {
    id: 'int-20',
    type: 'Call',
    callType: 'Incoming',
    channel: 'Phone',
    date: '2024-07-27T16:00:00Z',
    duration: '7m 19s',
    agent: agents[2],
    recordingUrl: '#',
    ticketId: 'TKT-009',
    content: 'Call regarding a payment reminder for an overdue invoice.'
  },
   {
    id: 'int-21',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-28T10:00:00Z',
    agent: agents[0],
    content: 'Chào bạn, mình có thể giúp gì cho bạn?',
    ticketId: 'TKT-010'
  },
  {
    id: 'int-22',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-28T10:01:00Z',
    agent: agents[0],
    content: 'Bạn có muốn biết thêm về sản phẩm của chúng tôi không?',
    ticketId: 'TKT-010'
  }
];

const allTickets: Ticket[] = [
  {
    id: 'TKT-001',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Order Status Inquiry',
    status: 'Resolved',
    agent: agents[1],
    createdAt: '2024-07-22T14:35:00Z',
    updatedAt: '2024-07-23T10:05:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-001').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
  {
    id: 'TKT-002',
    customerId: 'cus-2',
    customerName: 'Jane Smith',
    customerAvatarUrl: 'https://picsum.photos/seed/2/40/40',
    subject: 'Issue with new prescription',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: '2024-07-21T16:00:00Z',
    updatedAt: '2024-07-21T16:05:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-002'),
  },
  {
    id: 'TKT-003',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Return Request for ORD-001',
    status: 'New',
    agent: agents[0],
    createdAt: '2024-07-24T09:00:00Z',
    updatedAt: '2024-07-24T11:15:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-003').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
  {
    id: 'TKT-004',
    customerId: 'cus-2',
    customerName: 'Jane Smith',
    customerAvatarUrl: 'https://picsum.photos/seed/2/40/40',
    subject: 'Question about lens coating',
    status: 'New',
    agent: agents[1],
    createdAt: '2024-07-25T09:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-004').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
  {
    id: 'TKT-005',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Cracked lens on delivery',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: '2024-07-25T10:08:00Z',
    updatedAt: '2024-07-25T10:08:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-005').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
  {
    id: 'TKT-006',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Billing inquiry',
    status: 'Closed',
    agent: agents[0],
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-21T11:00:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-006').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
  {
    id: 'TKT-007',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Phone Call with John Doe',
    status: 'New',
    agent: agents[0],
    createdAt: '2024-07-26T10:00:00Z',
    updatedAt: '2024-07-26T10:00:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-007').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
   {
    id: 'TKT-008',
    customerId: 'cus-3',
    customerName: 'Emily Brown',
    customerAvatarUrl: 'https://picsum.photos/seed/3/40/40',
    subject: 'Store hours inquiry',
    status: 'Resolved',
    agent: agents[1],
    createdAt: '2024-07-15T11:00:00Z',
    updatedAt: '2024-07-15T11:05:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-008'),
  },
  {
    id: 'TKT-009',
    customerId: 'cus-5',
    customerName: 'David Wilson',
    customerAvatarUrl: 'https://picsum.photos/seed/5/40/40',
    subject: 'Overdue payment reminder',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: '2024-07-27T16:00:00Z',
    updatedAt: '2024-07-27T16:07:19Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-009'),
  },
  {
    id: 'TKT-010',
    customerId: 'cus-4',
    customerName: 'Michael Chen',
    customerAvatarUrl: 'https://picsum.photos/seed/4/40/40',
    subject: 'Zalo chat inquiry',
    status: 'New',
    agent: agents[0],
    createdAt: '2024-07-28T10:00:00Z',
    updatedAt: '2024-07-28T10:01:00Z',
    interactions: interactions.filter(i => i.ticketId === 'TKT-010'),
  }
];

tickets.push(...allTickets);
tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());


export let customers: Customer[] = [
  {
    id: 'cus-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
    avatarUrl: 'https://picsum.photos/seed/1/100/100',
    createdAt: '2024-01-15T09:00:00Z',
    identities: [
      { channel: 'Phone', identifier: '555-0101' },
      { channel: 'Email', identifier: 'john.doe@example.com' },
      { channel: 'Facebook', identifier: 'johndoe' },
    ],
    interactions: [], // This will be populated later
    orders: [
      {
        id: 'ORD-001',
        date: '2024-07-20T11:00:00Z',
        status: 'Shipped',
        total: 125.50,
        items: [{ id: 'item-a', name: 'Stylish Frames', quantity: 1, price: 125.50 }]
      },
      {
        id: 'ORD-000',
        date: '2024-01-20T11:00:00Z',
        status: 'Delivered',
        total: 99.00,
        items: [{ id: 'item-c', name: 'Reading Glasses', quantity: 1, price: 99.00 }]
      },
    ],
    eyeMeasurement: {
      od: { sph: '-1.25', cyl: '-0.50', ax: '180' },
      os: { sph: '-1.50', cyl: '-0.50', ax: '175' },
      pd: '63',
    },
    tags: ['VIP', 'Repeat Customer'],
    membership: {
      level: 'Gold',
      points: 2500,
      nextLevelPoints: 5000,
    },
    debt: {
        current: 50.25,
        history: [
            { date: '2024-07-01T10:00:00Z', amount: 100.00, reason: 'Initial Debt' },
            { date: '2024-07-15T12:00:00Z', amount: -49.75, reason: 'Partial Payment' }
        ]
    }
  },
  {
    id: 'cus-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
    avatarUrl: 'https://picsum.photos/seed/2/100/100',
    createdAt: '2024-03-22T11:30:00Z',
    identities: [
      { channel: 'Phone', identifier: '555-0102' },
      { channel: 'Zalo', identifier: 'janesmith.zalo' },
    ],
    interactions: [],
    orders: [
       {
        id: 'ORD-002',
        date: '2024-07-18T18:45:00Z',
        status: 'Delivered',
        total: 250.00,
        items: [{ id: 'item-b', name: 'Premium Lenses', quantity: 2, price: 125.00 }]
      },
    ],
    tags: ['New Customer'],
    membership: {
        level: 'Bronze',
        points: 50,
        nextLevelPoints: 500
    },
    debt: {
        current: 0,
        history: []
    }
  },
  {
    id: 'cus-3',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    phone: '555-0103',
    avatarUrl: 'https://picsum.photos/seed/3/100/100',
    createdAt: '2024-05-10T14:00:00Z',
    identities: [
      { channel: 'Phone', identifier: '555-0103' },
      { channel: 'Email', identifier: 'emily.brown@example.com' },
    ],
    interactions: [],
    orders: [],
    tags: ['Frequent Inquirer'],
    membership: {
      level: 'Silver',
      points: 750,
      nextLevelPoints: 2000,
    },
    debt: {
        current: 0,
        history: []
    }
  },
  {
    id: 'cus-4',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '555-0104',
    avatarUrl: 'https://picsum.photos/seed/4/100/100',
    createdAt: '2023-11-01T18:00:00Z',
    identities: [
      { channel: 'Phone', identifier: '555-0104' },
      { channel: 'Zalo', identifier: 'michaelchen.zalo' },
    ],
    interactions: [],
    orders: [
      {
        id: 'ORD-004',
        date: '2023-11-05T10:00:00Z',
        status: 'Delivered',
        total: 75.00,
        items: [{ id: 'item-d', name: 'Lens Cleaning Kit', quantity: 1, price: 75.00 }]
      },
    ],
    tags: [],
  },
  {
    id: 'cus-5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '555-0105',
    avatarUrl: 'https://picsum.photos/seed/5/100/100',
    createdAt: '2024-06-20T09:30:00Z',
    identities: [
      { channel: 'Phone', identifier: '555-0105' },
    ],
    interactions: [],
    orders: [
       {
        id: 'ORD-005',
        date: '2024-06-20T10:00:00Z',
        status: 'Pending',
        total: 150.00,
        items: [{ id: 'item-e', name: 'Designer Frames', quantity: 1, price: 150.00 }]
      }
    ],
    tags: ['Account Overdue'],
    debt: {
      current: 150.00,
      history: [
        { date: '2024-06-20T10:00:00Z', amount: 150.00, reason: 'Order ORD-005' },
      ]
    }
  },
  {
    id: 'cus-99',
    name: 'Unrecognized Caller',
    email: 'unknown@example.com',
    phone: '555-0199',
    avatarUrl: 'https://picsum.photos/seed/99/100/100',
    createdAt: 'N/A',
    identities: [
      { channel: 'Phone', identifier: '555-0199' },
    ],
    interactions: [],
    orders: [],
    tags: [],
  },
];


// Assign interactions to customers
customers.forEach(customer => {
  const customerTickets = allTickets.filter(t => t.customerId === customer.id);
  const customerTicketIds = customerTickets.map(t => t.id);
  // Get all interactions for this customer's tickets, plus any interactions without a ticket
  const customerInteractions = interactions.filter(i => 
    (i.ticketId && customerTicketIds.includes(i.ticketId))
  );
  customer.interactions = customerInteractions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// A customer's interactions should also include non-ticketed interactions associated with them.
// A simple way is to assign non-ticketed interactions to a customer.
// For this mock data, let's assign some generic interactions to customers.
const nonTicketedInteractions = interactions.filter(i => !i.ticketId);
if (customers[0]) {
    customers[0].interactions.push(...nonTicketedInteractions.filter(i => i.id === 'int-6' || i.id === 'int-17'));
}
if (customers[1]) {
    customers[1].interactions.push(...nonTicketedInteractions.filter(i => i.id === 'int-7'));
}

// Re-sort after adding more
customers.forEach(c => c.interactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

export const getCustomer = (id: string): Customer | undefined => customers.find(c => c.id === id);
export const getTicketsForCustomer = (customerId: string): Ticket[] => allTickets.filter(t => t.customerId === customerId);

export const allOrders: Order[] = customers.flatMap(c => c.orders);
export const allProducts: string[] = [...new Set(customers.flatMap(c => c.orders).flatMap(o => o.items).map(i => i.name))];
    
// This export needs to be here to avoid circular dependency issues in other files that use it.
export { allTickets as tickets, interactions };
