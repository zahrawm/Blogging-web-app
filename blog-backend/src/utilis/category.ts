export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt?: Date;
  }