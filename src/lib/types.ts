
export type Identity = {
  channel: 'Phone' | 'Facebook' | 'Zalo' | 'Email' | 'Instagram';
  identifier: string;
};

export type Interaction = {
  id: string;
  type: 'Call' | 'Chat' | 'Note' | 'Ticket';
  channel: Identity['channel'] | 'System';
  date: string;
  duration?: string; // for calls
  summary?: string;
  agent: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  callType?: 'Incoming' | 'Outgoing' | 'Missed';
  recordingUrl?: string; // for calls
  transcript?: string; // for calls
  content: string; // for notes/chats/purpose
  ticketId?: string;
  isLive?: boolean; // for live interactions like calls
  
  // Detailed call fields
  startTime?: string;
  endTime?: string;
  purpose?: string;
  discussion?: string;
  output?: string;
  nextAction?: string;
};

export type Order = {
  id: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

export type EyeMeasurement = {
  od: {
    sph: string;
    cyl: string;
    ax: string;
  };
  os: {
    sph: string;
    cyl: string;
    ax: string;
  };
  pd: string;
};

export type DebtHistoryItem = {
    date: string;
    amount: number;
    reason: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  createdAt: string;
  identities: Identity[];
  interactions: Interaction[];
  orders: Order[];
  eyeMeasurement?: EyeMeasurement;
  tags: string[];
  membership?: {
    level: 'Bronze' | 'Silver' | 'Gold';
    points: number;
    nextLevelPoints: number;
  };
  debt?: {
    current: number;
    history: DebtHistoryItem[];
  };
};

export type Ticket = {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatarUrl: string;
  subject: string;
  status: 'New' | 'In-Progress' | 'Resolved' | 'Closed';
  agent: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  interactions: Interaction[];
};

    
