export type Identity = {
  channel: 'Phone' | 'Facebook' | 'Zalo' | 'Email';
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
  recordingUrl?: string; // for calls
  content: string; // for notes/chats
  ticketId?: string;
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
