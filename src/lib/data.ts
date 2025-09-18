import { Customer, Ticket, Interaction, Order, CallEvent } from './types';
import { addHours, isAfter, subHours, subMinutes } from 'date-fns';

export const agents = [
  { id: 'agent-1', name: 'Alex Green', avatarUrl: 'https://picsum.photos/seed/101/40/40' },
  { id: 'agent-2', name: 'Brianna White', avatarUrl: 'https://picsum.photos/seed/102/40/40' },
  { id: 'agent-3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/103/40/40' },
];

export const getTicket = (id: string): Ticket | undefined => tickets.find(t => t.id === id);


export const interactions: Interaction[] = [
  {
    id: 'int-1',
    type: 'Call',
    channel: 'Phone',
    callType: 'Incoming',
    date: '2024-07-22T14:30:00Z',
    duration: '5m 32s',
    agent: agents[0],
    recordingUrl: '#',
    purpose: 'Order Status Inquiry',
    discussion: 'Customer called to ask about the shipping status of order #ORD-001.',
    output: 'Provided tracking number and link.',
    nextAction: 'None, customer satisfied.',
    ticketId: 'TKT-001',
    events: [
        { id: 'evt-1-1', type: 'Initiated', date: '2024-07-22T14:29:58Z', agent: agents[0] },
        { id: 'evt-1-2', type: 'Ringing', date: '2024-07-22T14:30:00Z', agent: agents[0] },
        { id: 'evt-1-3', type: 'Answered', date: '2024-07-22T14:30:05Z', agent: agents[0] },
        { id: 'evt-1-4', type: 'Ended', date: '2024-07-22T14:35:37Z', agent: agents[0] },
    ]
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
    purpose: 'Follow-up on order status',
    discussion: 'Followed up via Facebook chat to provide tracking number.',
    output: 'Customer confirmed receipt of the tracking number.',
    nextAction: 'Monitor delivery status.',
    ticketId: 'TKT-001'
  },
  {
    id: 'int-4',
    type: 'Note',
    channel: 'System',
    date: '2024-07-23T10:05:00Z',
    agent: agents[1],
    purpose: 'Internal Note',
    discussion: 'Customer confirmed receipt of tracking number. Marked ticket as resolved.',
    output: '',
    nextAction: '',
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
    purpose: 'Profile Update',
    discussion: 'Customer called to update their prescription details.',
    output: 'Updated Eye Measurement profile.',
    nextAction: 'None.'
  },
  {
    id: 'int-7',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-05-30T17:20:00Z',
    agent: agents[2],
    purpose: 'Return Policy Inquiry',
    discussion: 'Customer asked about our return policy.',
    output: 'Sent them a link to the FAQ page.',
    nextAction: 'None.'
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
    purpose: 'Return Request',
    discussion: 'Customer called to request a return for order ORD-001. Claims the frames are not as expected.',
    output: 'Return process initiated. Return label sent to customer.',
    nextAction: 'Wait for customer to ship the item back.',
    events: [
        { id: 'evt-8-1', type: 'Initiated', date: '2024-07-24T10:59:58Z', agent: agents[0] },
        { id: 'evt-8-2', type: 'Ringing', date: '2024-07-24T11:00:00Z', agent: agents[0] },
        { id: 'evt-8-3', type: 'Answered', date: '2024-07-24T11:00:10Z', agent: agents[0] },
        { id: 'evt-8-4', type: 'Ended', date: '2024-07-24T11:12:25Z', agent: agents[0] },
    ]
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
    purpose: 'Follow-up on Cracked Lens',
    discussion: 'Called customer to confirm details about a cracked lens on a recent order.',
    output: 'Confirmed shipping of a replacement lens.',
    nextAction: 'Track replacement shipment.',
    events: [
        { id: 'evt-11-1', type: 'Initiated', date: '2024-07-25T09:59:58Z', agent: agents[2] },
        { id: 'evt-11-2', type: 'Answered', date: '2024-07-25T10:00:05Z', agent: agents[2] },
        { id: 'evt-11-3', type: 'Ended', date: '2024-07-25T10:08:50Z', agent: agents[2] },
    ]
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
    purpose: 'Return Discussion',
    discussion: 'Initiated call to discuss return of ORD-001.',
    output: 'Customer agreed to the return process.',
    nextAction: 'Send return instructions email.',
    events: [
        { id: 'evt-16-1', type: 'Initiated', date: '2024-07-26T09:59:58Z', agent: agents[0] },
        { id: 'evt-16-2', type: 'Answered', date: '2024-07-26T10:00:05Z', agent: agents[0] },
        { id: 'evt-16-3', type: 'Ended', date: '2024-07-26T10:02:35Z', agent: agents[0] },
    ]
  },
  {
    id: 'int-17',
    type: 'Call',
    callType: 'Missed',
    channel: 'Phone',
    date: '2024-07-26T12:00:00Z',
    agent: agents[1],
    purpose: 'Missed Call',
    discussion: 'Missed call from customer.',
    output: '',
    nextAction: 'Return the call.',
    events: [
        { id: 'evt-17-1', type: 'Initiated', date: '2024-07-26T11:59:58Z', agent: agents[0] },
        { id: 'evt-17-2', type: 'Ringing', date: '2024-07-26T12:00:00Z', agent: agents[0] },
        { id: 'evt-17-3', type: 'Missed', date: '2024-07-26T12:00:20Z', agent: agents[0] },
        { id: 'evt-17-4', type: 'Transferred', date: '2024-07-26T12:00:21Z', agent: agents[1] },
        { id: 'evt-17-5', type: 'Ringing', date: '2024-07-26T12:00:22Z', agent: agents[1] },
        { id: 'evt-17-6', type: 'Missed', date: '2024-07-26T12:00:42Z', agent: agents[1] },
        { id: 'evt-17-7', type: 'Ended', date: '2024-07-26T12:00:45Z', agent: agents[1] },
    ]
  },
  {
    id: 'int-18',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-15T11:00:00Z',
    agent: agents[1],
    purpose: 'Store Hours Inquiry',
    discussion: 'Customer inquired about store opening hours.',
    output: 'Provided store hours.',
    nextAction: 'None.',
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
    purpose: 'Payment Reminder',
    discussion: 'Call regarding a payment reminder for an overdue invoice.',
    output: 'Customer promised to pay by end of day.',
    nextAction: 'Check payment status tomorrow.',
    events: [
        { id: 'evt-20-1', type: 'Initiated', date: '2024-07-27T15:59:58Z', agent: agents[2] },
        { id: 'evt-20-2', type: 'Ringing', date: '2024-07-27T16:00:00Z', agent: agents[2] },
        { id: 'evt-20-3', type: 'Answered', date: '2024-07-27T16:00:08Z', agent: agents[2] },
        { id: 'evt-20-4', type: 'Ended', date: '2024-07-27T16:07:27Z', agent: agents[2] },
    ]
  },
   {
    id: 'int-21',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-28T10:00:00Z',
    agent: agents[0],
    purpose: 'General Inquiry',
    discussion: 'Chào bạn, mình có thể giúp gì cho bạn?',
    output: '',
    nextAction: '',
    ticketId: 'TKT-010'
  },
  {
    id: 'int-22',
    type: 'Chat',
    channel: 'Zalo',
    date: '2024-07-28T10:01:00Z',
    agent: agents[0],
    purpose: 'Product Info',
    discussion: 'Bạn có muốn biết thêm về sản phẩm của chúng tôi không?',
    output: '',
    nextAction: '',
    ticketId: 'TKT-010'
  }
];

const now = new Date();

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
    sla: { status: 'Met', resolutionDue: '2024-07-23T14:35:00Z' }
  },
  {
    id: 'TKT-002',
    customerId: 'cus-2',
    customerName: 'Jane Smith',
    customerAvatarUrl: 'https://picsum.photos/seed/2/40/40',
    subject: 'Issue with new prescription',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: subHours(now, 26).toISOString(),
    updatedAt: subHours(now, 1).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-002'),
    sla: { status: 'Breached', resolutionDue: addHours(subHours(now, 26), 24).toISOString() }
  },
  {
    id: 'TKT-003',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Return Request for ORD-001',
    status: 'New',
    agent: agents[0],
    createdAt: subHours(now, 2).toISOString(),
    updatedAt: subHours(now, 1).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-003').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    sla: { status: 'Met', resolutionDue: addHours(now, 22).toISOString() }
  },
  {
    id: 'TKT-004',
    customerId: 'cus-2',
    customerName: 'Jane Smith',
    customerAvatarUrl: 'https://picsum.photos/seed/2/40/40',
    subject: 'Question about lens coating',
    status: 'New',
    agent: agents[1],
    createdAt: subHours(now, 22).toISOString(),
    updatedAt: subHours(now, 22).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-004').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    sla: { status: 'At Risk', resolutionDue: addHours(subHours(now, 22), 24).toISOString() }
  },
  {
    id: 'TKT-005',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Cracked lens on delivery',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: subHours(now, 40).toISOString(),
    updatedAt: subHours(now, 18).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-005').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    sla: { status: 'Breached', resolutionDue: addHours(subHours(now, 40), 24).toISOString() }
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
    sla: { status: 'Met', resolutionDue: '2024-07-21T10:00:00Z' }
  },
  {
    id: 'TKT-007',
    customerId: 'cus-1',
    customerName: 'John Doe',
    customerAvatarUrl: 'https://picsum.photos/seed/1/40/40',
    subject: 'Phone Call with John Doe',
    status: 'New',
    agent: agents[0],
    createdAt: subMinutes(now, 10).toISOString(),
    updatedAt: subMinutes(now, 5).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-007').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    sla: { status: 'Met', resolutionDue: addHours(now, 24).toISOString() }
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
    sla: { status: 'Met', resolutionDue: '2024-07-16T11:00:00Z' }
  },
  {
    id: 'TKT-009',
    customerId: 'cus-5',
    customerName: 'David Wilson',
    customerAvatarUrl: 'https://picsum.photos/seed/5/40/40',
    subject: 'Overdue payment reminder',
    status: 'In-Progress',
    agent: agents[2],
    createdAt: subHours(now, 23).toISOString(),
    updatedAt: subHours(now, 4).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-009'),
    sla: { status: 'At Risk', resolutionDue: addHours(subHours(now, 23), 24).toISOString() }
  },
  {
    id: 'TKT-010',
    customerId: 'cus-4',
    customerName: 'Michael Chen',
    customerAvatarUrl: 'https://picsum.photos/seed/4/40/40',
    subject: 'Zalo chat inquiry',
    status: 'New',
    agent: agents[0],
    createdAt: subHours(now, 1).toISOString(),
    updatedAt: subHours(now, 1).toISOString(),
    interactions: interactions.filter(i => i.ticketId === 'TKT-010'),
    sla: { status: 'Met', resolutionDue: addHours(now, 23).toISOString() }
  }
];

const tickets: Ticket[] = [...allTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

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
    
export { tickets };
