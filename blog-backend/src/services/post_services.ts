
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { Post } from '../utilis/post';

const prisma = new PrismaClient();

export class PostService {
  async delete(id: number): Promise<Post | null> {
    try {
      const deletedPost = await prisma.post.delete({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
              bio: true
            }
          },
          category: true,
          tags: true
        }
      });
      
      return deletedPost as unknown as Post;
    } catch (error) {
      console.error('Error deleting post:', error);
      return null;
    }
  }
  
  async incrementViewCount(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }
  
  async findByAuthor(authorId: number, skip = 0, take = 10): Promise<{ posts: Post[]; total: number }> {
    const where = { authorId };
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
              bio: true
            }
          },
          category: true,
          tags: true
        }
      }),
      prisma.post.count({ where })
    ]);
    
    return {
      posts: posts as unknown as Post[],
      total
    };
  }
  
  async findAll(
    skip = 0, 
    take = 10, 
    status: 'draft' | 'published' | 'archived' | 'all' = 'published',
    categoryId?: number,
    authorId?: number,
    tag?: string,
    searchQuery?: string
  ): Promise<{ posts: Post[]; total: number }> {
    const where: any = {};
    
    // Filter by status unless 'all' is specified
    if (status !== 'all') {
      where.status = status;
    }
    
    // Filter by visibility if no user is logged in
    where.visibility = 'public';
    
    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // Filter by author
    if (authorId) {
      where.authorId = authorId;
    }
    
    // Filter by tag
    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      };
    }
    
    // Search by title or content
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
              bio: true
            }
          },
          category: true,
          tags: true
        }
      }),
      prisma.post.count({ where })
    ]);
    
    return {
      posts: posts as unknown as Post[],
      total
    };
  }

  async findById(id: number, includeRelations = true): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: includeRelations ? {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: true
      } : undefined
    });
    
    return post as unknown as Post;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    return post as unknown as Post;
  }

  async create(postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'viewCount' | 'commentCount' | 'likeCount'>): Promise<Post> {
    // Generate slug from title
    let slug = slugify(postData.title, { lower: true });
    
    // Check if slug exists
    const existingPost = await prisma.post.findFirst({
      where: { slug }
    });
    
    // If slug exists, append a unique identifier
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }
    
    // Extract tag IDs
    const { tagIds, ...postDataWithoutTags } = postData;
    
    const post = await prisma.post.create({
      data: {
        ...postDataWithoutTags,
        slug,
        viewCount: 0,
        commentCount: 0,
        likeCount: 0,
        tags: {
          connect: tagIds?.map(id => ({ id })) || []
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    return post as unknown as Post;
  }

  async update(id: number, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'authorId'>>): Promise<Post | null> {
    const post = await this.findById(id, false);
    
    if (!post) {
      return null;
    }
    
    // Generate new slug if title changed
    let slug = post.slug;
    if (postData.title && postData.title !== post.title) {
      slug = slugify(postData.title, { lower: true });
      
      // Check if new slug exists
      const existingPost = await prisma.post.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      // If slug exists, append a unique identifier
      if (existingPost) {
        slug = `${slug}-${Date.now()}`;
      }
    }
    
    // Extract tag IDs for relationship updates
    const { tagIds, ...postDataWithoutTags } = postData as any;
    
    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postDataWithoutTags,
        slug,
        updatedAt: new Date(),
        ...(tagIds && {
          tags: {
            set: [], // Remove existing tags
            connect: tagIds.map((id: number) => ({ id })) // Add new tags
          }
        })
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    return updatedPost as unknown as Post;
  }
}