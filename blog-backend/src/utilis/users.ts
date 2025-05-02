export interface User {
    id: number;
    username: string;
    email: string;
    password: string; // Hashed password stored in database
    fullName: string;
    avatar?: string;
    bio?: string;
    role: 'admin' | 'author' | 'subscriber';
    createdAt: Date;
    updatedAt?: Date;
    lastLogin?: Date;
  }