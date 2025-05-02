/**
 * Validation rule interface for input validation
 */
interface ValidationRule {
    type?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  }
  
  /**
   * Validation rules map for validating objects
   */
  interface ValidationRules {
    [key: string]: ValidationRule;
  }
  
  
  interface ValidationError {
    field: string;
    message: string;
  }
  

  export function validate(data: Record<string, any>, rules: ValidationRules): ValidationError[] {
    const errors: ValidationError[] = [];
  
    for (const field in rules) {
      const value = data[field];
      const rule = rules[field];
  
     
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: `${field} is required`
        });
        continue; 
      }
  
     
      if (value === undefined || value === null || value === '') {
        continue;
      }
  
      // Type check
      if (rule.type) {
        const actualType = typeof value;
        if (rule.type === 'array' && !Array.isArray(value)) {
          errors.push({
            field,
            message: `${field} must be an array`
          });
        } else if (rule.type !== 'array' && actualType !== rule.type) {
          errors.push({
            field,
            message: `${field} must be a ${rule.type}`
          });
        }
      }
  
      // String validations
      if (typeof value === 'string') {
        // Min length
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          errors.push({
            field,
            message: `${field} must be at least ${rule.minLength} characters`
          });
        }
  
        // Max length
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          errors.push({
            field,
            message: `${field} must be no more than ${rule.maxLength} characters`
          });
        }
  
        // Pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field,
            message: `${field} has an invalid format`
          });
        }
      }
  
      if (typeof value === 'number') {
        
        if (rule.min !== undefined && value < rule.min) {
          errors.push({
            field,
            message: `${field} must be at least ${rule.min}`
          });
        }
  
       
        if (rule.max !== undefined && value > rule.max) {
          errors.push({
            field,
            message: `${field} must be no more than ${rule.max}`
          });
        }
      }
  
     
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push({
            field,
            message: typeof result === 'string' ? result : `${field} is invalid`
          });
        }
      }
    }
  
    return errors;
  }