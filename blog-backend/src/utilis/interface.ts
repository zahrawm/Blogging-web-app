export interface Post {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    category: {
      id: number;
      name: string;
    };
    tags: string[];
    featuredImage?: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
    viewCount: number;
    commentCount: number;
    likeCount: number;
  }