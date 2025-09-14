import { Customer, Ticket, Interaction } from './types';

export const agents = [
  { id: 'agent-1', name: 'Alex Green', avatarUrl: 'https://picsum.photos/seed/101/40/40' },
  { id: 'agent-2', name: 'Brianna White', avatarUrl: 'https://picsum.photos/seed/102/40/40' },
  { id: 'agent-3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/103/40/40' },
];

const interactions: Interaction[] = [
  {
    id: 'int-1',
    type: 'Call',
    channel: 'Phone',
    date: '2024-07-22T14:30:00Z',
    duration: '5m 32s',
    agent: agents[0],
    recordingUrl: '#',
    summary: 'Initial inquiry about order status.',
    content: 'Customer called to ask about the shipping status of order #ORD-001.'
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
    content: 'Followed up via Facebook chat to provide tracking number.'
  },
  {
    id: 'int-4',
    type: 'Note',
    channel: 'System',
    date: '2024-07-23T10:05:00Z',
    agent: agents[1],
    content: 'Customer confirmed receipt of tracking number. Happy with the quick response.'
  }
];

export const customers: Customer[] = [
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
    interactions: interactions,
    orders: [
      {
        id: 'ORD-001',
        date: '2024-07-20T11:00:00Z',
        status: 'Shipped',
        total: 125.50,
        items: [{ id: 'item-a', name: 'Stylish Frames', quantity: 1, price: 125.50 }]
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
    interactions: [
      {
        id: 'int-5',
        type: 'Ticket',
        channel: 'System',
        date: '2024-07-21T16:00:00Z',
        agent: agents[2],
        ticketId: 'TKT-002',
        content: 'Ticket TKT-002 created: "Issue with new prescription".'
      }
    ],
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

export const tickets: Ticket[] = [
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
    interactions: interactions.filter(i => i.ticketId === 'TKT-001' || i.id === 'int-1' || i.id === 'int-3' || i.id === 'int-4'),
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
    updatedAt: '2024-07-24T09:00:00Z',
    interactions: [],
  }
];

export const getCustomer = (id: string) => customers.find(c => c.id === id);
export const getTicket = (id: string) => tickets.find(t => t.id === id);
export const getTicketsForCustomer = (customerId: string) => tickets.filter(t => t.customerId === customerId);
