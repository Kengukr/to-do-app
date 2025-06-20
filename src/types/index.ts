
export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface TodoList {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  participants: Participant[];
}

export interface Participant {
  email: string;
  role: 'viewer' | 'admin';
  userId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  listId: string;
  createdAt: Date;
  createdBy: string;
}
