import { User } from './users';
import { Category } from './category';
import { Tag } from './tag';

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: number; 
  author?: Omit<User, 'password' | 'email'>; 
  categoryId: number;
  category?: Category;
  tagIds: number[]; 
  tags?: Tag[];
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'members';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}