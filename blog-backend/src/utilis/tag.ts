/**
 * Tag interface representing tag entities in the system
 */
export interface Tag {
  /**
   * Unique identifier for the tag
   */
  id: number;
  
  /**
   * Display name of the tag
   */
  name: string;
  
  /**
   * URL-friendly version of the tag name
   */
  slug: string;
  
  /**
   * Date when the tag was created
   */
  createdAt: Date;
  
  /**
   * Date when the tag was last updated
   * Optional as it may not exist for newly created tags
   */
  updatedAt?: Date;
  
  /**
   * Number of posts associated with this tag
   * Optional as it might not always be loaded/required
   */
  postCount?: number;
  
  /**
   * Flag indicating if this is a featured/important tag
   */
  isFeatured?: boolean;
  
  /**
   * Optional description for the tag
   */
  description?: string;
  
  /**
   * Optional color code for styling the tag
   */
  colorCode?: string;
}