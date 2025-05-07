import { Request, Response } from 'express';
import * as PostService from '../services/postservices';
import * as AuthService from '../services/authservices';
import { Post } from '../utilis/post';


export const getAllPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostService.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

 
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }
    
    const post = await PostService.findById(id);
    
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
};

/**
 * Create a new blog post
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    
    // Get the user ID from the authenticated request
    const userId = (req as any).userId;
    const user = await AuthService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const now = new Date();
    const newPost: Omit<Post, 'id'> = {
      title,
      content: content || '',
      author: user.username, // Set the author to the authenticated user's username
      createdAt: now,
      updatedAt: now
    };
    
    const post = await PostService.create(newPost);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/**
 * Update an existing blog post
 */
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }
    
    const { title, content } = req.body;
    
    const existingPost = await PostService.findById(id);
    
    if (!existingPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    // The authentication middleware already verified that the user is the author,
    // so we can proceed with the update
    
    const updatedPost: Post = {
      id,
      title: title !== undefined ? title : existingPost.title,
      content: content !== undefined ? content : existingPost.content,
      author: existingPost.author, // Keep the original author
      createdAt: existingPost.createdAt,
      updatedAt: new Date()
    };
    
    const post = await PostService.update(id, updatedPost);
    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

/**
 * Delete a blog post
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }
    
    // The authentication middleware already verified that the user is the author,
    // so we can proceed with the deletion
    
    const deleted = await PostService.remove(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};