/**
 * Input Sanitization & Output Encoding Utilities
 * Protects against XSS (Cross-Site Scripting) and injection attacks
 */

import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

/**
 * Sanitize HTML input - removes all HTML tags, prevents XSS
 * Used for text fields like names, descriptions, comments
 */
export function sanitizeHtmlInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });
}

/**
 * Sanitize user-provided HTML with limited tags
 * Used for rich text editors (if needed)
 * WARNING: Only use this if you explicitly allow user HTML
 */
export function sanitizeRichHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
    allowedIframeHostnames: [],
    disallowedTagsMode: 'discard',
  });
}

/**
 * Validate and sanitize email addresses
 * Returns empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!validator.isEmail(email)) {
    return '';
  }
  return validator.normalizeEmail(email) || '';
}

/**
 * Sanitize URL input
 * Returns empty string if invalid or potentially malicious
 */
export function sanitizeUrl(url: string): string {
  if (!validator.isURL(url, { require_protocol: true })) {
    return '';
  }
  // Prevent javascript: and data: URLs
  if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
    return '';
  }
  return validator.trim(url);
}

/**
 * Sanitize file names to prevent directory traversal attacks
 * Removes special characters and path separators
 */
export function sanitizeFileName(filename: string): string {
  // Remove path separators and special characters
  return filename
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\./g, '')
    .trim();
}

/**
 * Sanitize JSON input - validates structure
 * Returns null if invalid JSON
 */
export function sanitizeJson(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input);
    // Ensure it's an object, not an array or primitive
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Escape HTML entities for safe display in templates
 * React auto-escapes, but useful for raw HTML contexts
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize database search input - prevents SQL injection when used with parameterized queries
 * (ORM like Prisma handles this, but good practice to sanitize input anyway)
 */
export function sanitizeSearch(input: string): string {
  return validator.trim(input).substring(0, 100); // Limit to 100 chars
}

/**
 * Comprehensive sanitization for generic user input
 * Removes HTML, trims whitespace, validates length
 */
export function sanitizeUserInput(
  input: string,
  options: { minLength?: number; maxLength?: number } = {}
): string {
  const { minLength = 0, maxLength = 1000 } = options;

  let sanitized = validator.trim(input);
  sanitized = sanitizeHtml(sanitized, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (sanitized.length < minLength || sanitized.length > maxLength) {
    return '';
  }

  return sanitized;
}

/**
 * Validate input against common attack patterns
 * Returns true if input appears safe
 */
export function isInputSafe(input: string): boolean {
  // Check for common SQL injection patterns
  const sqlInjectionPatterns = /('|(--)|;|\/\*|\*\/|(xp_)|(sp_))/gi;
  if (sqlInjectionPatterns.test(input)) {
    return false;
  }

  // Check for common XSS patterns
  const xssPatterns = /<script|<iframe|javascript:|on\w+\s*=/gi;
  if (xssPatterns.test(input)) {
    return false;
  }

  return true;
}
