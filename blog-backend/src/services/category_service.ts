
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { Category } from '../utilis/category';

const prisma = new PrismaClient();

export class CategoryService {
  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return categories as unknown as Category[];
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    return category as unknown as Category;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { slug }
    });
    
    return category as unknown as Category;
  }

  async create(name: string, description?: string): Promise<Category> {
    let slug = slugify(name, { lower: true });
    
    // Check if slug exists
    const existingCategory = await prisma.category.findFirst({
      where: { slug }
    });
    
    // If slug exists, append a unique identifier
    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        createdAt: new Date()
      }
    });
    
    return category as unknown as Category;
  }

  async update(id: number, name?: string, description?: string): Promise<Category | null> {
    const category = await this.findById(id);
    
    if (!category) {
      return null;
    }
    
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name, { lower: true });
      
      // Check if new slug exists
      const existingCategory = await prisma.category.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      // If slug exists, append a unique identifier
      if (existingCategory) {
        slug = `${slug}-${Date.now()}`;
      }
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || category.name,
        slug,
        description: description !== undefined ? description : category.description,
        updatedAt: new Date()
      }
    });
    
    return updatedCategory as unknown as Category;
  }

  async delete(id: number): Promise<Category | null> {
    try {
      // Check if category has posts
      const postsCount = await prisma.post.count({
        where: { categoryId: id }
      });
      
      if (postsCount > 0) {
        throw new Error('Cannot delete category with associated posts');
      }
      
      const deletedCategory = await prisma.category.delete({
        where: { id }
      });
      
      return deletedCategory as unknown as Category;
    } catch (error) {
      console.error('Error deleting category:', error);
      return null;
    }
  }
}