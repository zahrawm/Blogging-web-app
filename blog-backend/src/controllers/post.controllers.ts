import { Request, Response } from 'express';
import { PostService } from '../services/post_services';
import { CategoryService } from '../services/category_service';
import { TagService } from '../services/tag_service';


export class PostController {
  private postService: PostService;
  private categoryService: CategoryService;
  private tagService: TagService;

  constructor(
    postService: PostService,
    categoryService: CategoryService,
    tagService: TagService
  ) {
    this.postService = postService;
    this.categoryService = categoryService;
    this.tagService = tagService;
  }

  async getAllPosts(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const status = req.query.status as 'draft' | 'published' | 'archived' | 'all' || 'published';
      const categoryId = req.query.category ? parseInt(req.query.category as string) : undefined;
      const authorId = req.query.author ? parseInt(req.query.author as string) : undefined;
      const tag = req.query.tag as string;
      const searchQuery = req.query.search as string;
      
      // If user is not authenticated or is not an admin, only show published posts
      const userRole = req.user?.role;
      const finalStatus = (!req.user || (userRole !== 'admin' && userRole !== 'author')) ? 'published' : status;
      
      const { posts, total } = await this.postService.findAll(
        skip,
        limit,
        finalStatus,
        categoryId,
        authorId,
        tag,
        searchQuery
      );
      
      return res.status(200).json({
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all posts error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const post = await this.postService.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check if user can view this post
      const userRole = req.user?.role;
      const isAuthor = req.user?.id === post.authorId;
      
      if (post.status !== 'published' && !isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to view this post' });
      }
      
      if (post.visibility !== 'public' && !req.user) {
        return res.status(403).json({ message: 'This post requires authentication to view' });
      }
      
      if (post.visibility === 'private' && !isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'This is a private post' });
      }
      
      // Increment view count
      await this.postService.incrementViewCount(postId);
      
      return res.status(200).json(post);
    } catch (error) {
      console.error('Get post by ID error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPostBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const slug = req.params.slug;
      
      const post = await this.postService.findBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check if user can view this post
      const userRole = req.user?.role;
      const isAuthor = req.user?.id === post.authorId;
      
      if (post.status !== 'published' && !isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to view this post' });
      }
      
      if (post.visibility !== 'public' && !req.user) {
        return res.status(403).json({ message: 'This post requires authentication to view' });
      }
      
      if (post.visibility === 'private' && !isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'This is a private post' });
      }
      
      // Increment view count
      await this.postService.incrementViewCount(post.id);
      
      return res.status(200).json(post);
    } catch (error) {
      console.error('Get post by slug error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const { title, content, excerpt, categoryId, tagIds, featuredImage, status, visibility } = req.body;
      
      if (!title || !content || !categoryId) {
        return res.status(400).json({ message: 'Title, content, and category are required' });
      }
      
      // Check if category exists
      const category = await this.categoryService.findById(categoryId);
      
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
      
      // Check if all tags exist
      if (tagIds && tagIds.length > 0) {
        const tags = await this.tagService.findByIds(tagIds);
        
        if (tags.length !== tagIds.length) {
          return res.status(400).json({ message: 'One or more tags not found' });
        }
      }
      
      const post = await this.postService.create({
        title,
        content,
        excerpt: excerpt || content.substring(0, 160) + '...',
        authorId: req.user.id,
        categoryId,
        tagIds: tagIds || [],
        featuredImage,
        status: status || 'draft',
        visibility: visibility || 'public'
      });
      
      return res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePost(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const post = await this.postService.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check permissions
      const userRole = req.user?.role;
      const isAuthor = req.user?.id === post.authorId;
      
      if (!isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to update this post' });
      }
      
      const { title, content, excerpt, categoryId, tagIds, featuredImage, status, visibility } = req.body;
      
      // Check if category exists if provided
      if (categoryId) {
        const category = await this.categoryService.findById(categoryId);
        
        if (!category) {
          return res.status(400).json({ message: 'Category not found' });
        }
      }
      
      // Check if all tags exist if provided
      if (tagIds && tagIds.length > 0) {
        const tags = await this.tagService.findByIds(tagIds);
        
        if (tags.length !== tagIds.length) {
          return res.status(400).json({ message: 'One or more tags not found' });
        }
      }
      
      const updatedPost = await this.postService.update(postId, {
        title,
        content,
        excerpt,
        categoryId,
        tagIds,
        featuredImage,
        status,
        visibility
      });
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Update post error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const post = await this.postService.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check permissions
      const userRole = req.user?.role;
      const isAuthor = req.user?.id === post.authorId;
      
      if (!isAuthor && userRole !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to delete this post' });
      }
      
      await this.postService.delete(postId);
      
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMyPosts(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const { posts, total } = await this.postService.findByAuthor(req.user.id, skip, limit);
      
      return res.status(200).json({
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get my posts error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}