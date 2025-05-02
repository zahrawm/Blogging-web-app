
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { Tag } from '../utilis/tag';

const prisma = new PrismaClient();

export class TagService {
  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return tags as unknown as Tag[];
  }

  async findById(id: number): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id }
    });
    
    return tag as unknown as Tag;
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return tags as unknown as Tag[];
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { slug }
    });
    
    return tag as unknown as Tag;
  }

  async create(name: string): Promise<Tag> {
    let slug = slugify(name, { lower: true });
    
    // Check if slug exists
    const existingTag = await prisma.tag.findFirst({
      where: { slug }
    });
    
    // If slug exists, append a unique identifier
    if (existingTag) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        createdAt: new Date()
      }
    });
    
    return tag as unknown as Tag;
  }

  async update(id: number, name: string): Promise<Tag | null> {
    const tag = await this.findById(id);
    
    if (!tag) {
      return null;
    }
    
    let slug = tag.slug;
    if (name !== tag.name) {
      slug = slugify(name, { lower: true });
      
      // Check if new slug exists
      const existingTag = await prisma.tag.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      // If slug exists, append a unique identifier
      if (existingTag) {
        slug = `${slug}-${Date.now()}`;
      }
    }
    
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        updatedAt: new Date()
      }
    });
    
    return updatedTag as unknown as Tag;
  }

  async delete(id: number): Promise<Tag | null> {
    try {
      // Remove tag from all posts
      await prisma.post.update({
        where: {
          tags: {
            some: {
              id
            }
          }
        },
        data: {
          tags: {
            disconnect: { id }
          }
        }
      });
      
      const deletedTag = await prisma.tag.delete({
        where: { id }
      });
      
      return deletedTag as unknown as Tag;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return null;
    }
  }
}