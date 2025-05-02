import { User } from './users';

export interface Comment {
  id: number;
  postId: number;
  content: string;
  authorId: number;
  author?: Omit<User, 'password' | 'email'>;
  parentId?: number; 
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
}