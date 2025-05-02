import { Request, Response } from 'express';
import { TagService } from '../services/tag_service';
import { validate } from '../utilis/validate';

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  /**
   * Get all tags
   * @route GET /api/tags
   */
  async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await this.tagService.findAll();
      res.status(200).json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ message: 'Failed to fetch tags' });
    }
  }

  
  async getTagById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid tag ID' });
        return;
      }

      const tag = await this.tagService.findById(id);
      
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      
      res.status(200).json(tag);
    } catch (error) {
      console.error('Error fetching tag:', error);
      res.status(500).json({ message: 'Failed to fetch tag' });
    }
  }

  
  async getTagBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      
      if (!slug) {
        res.status(400).json({ message: 'Slug is required' });
        return;
      }

      const tag = await this.tagService.findBySlug(slug);
      
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      
      res.status(200).json(tag);
    } catch (error) {
      console.error('Error fetching tag by slug:', error);
      res.status(500).json({ message: 'Failed to fetch tag' });
    }
  }

  
  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      
      const errors = validate({ name }, {
        name: { type: 'string', required: true, minLength: 1 }
      });
      
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const newTag = await this.tagService.create(name);
      res.status(201).json(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ message: 'Failed to create tag' });
    }
  }

  
  async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid tag ID' });
        return;
      }
      
      
      const errors = validate({ name }, {
        name: { type: 'string', required: true, minLength: 1 }
      });
      
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const updatedTag = await this.tagService.update(id, name);
      
      if (!updatedTag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      
      res.status(200).json(updatedTag);
    } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({ message: 'Failed to update tag' });
    }
  }

  /**
   * Delete a tag
   * @route DELETE /api/tags/:id
   */
  async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid tag ID' });
        return;
      }

      const deletedTag = await this.tagService.delete(id);
      
      if (!deletedTag) {
        res.status(404).json({ message: 'Tag not found or could not be deleted' });
        return;
      }
      
      res.status(200).json({ message: 'Tag deleted successfully', tag: deletedTag });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ message: 'Failed to delete tag' });
    }
  }
}