import { describe, it, expect } from 'vitest';
import {
  reportSchema,
  loginSchema,
  messageSchema,
} from '@/lib/validation';

describe('validation schemas', () => {
  describe('reportSchema', () => {
    it('should validate a valid report', () => {
      const validReport = {
        title: 'Broken sidewalk',
        description: 'There is a large crack in the sidewalk',
        photoFile: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        location: {
          lat: 48.8566,
          lng: 2.3522,
          address: 'Paris, France',
        },
      };

      const result = reportSchema.safeParse(validReport);
      expect(result.success).toBe(true);
    });

    it('should fail when photo is missing', () => {
      const invalidReport = {
        title: 'Broken sidewalk',
        description: 'There is a large crack in the sidewalk',
        location: {
          lat: 48.8566,
          lng: 2.3522,
          address: 'Paris, France',
        },
      };

      const result = reportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should fail when location is invalid', () => {
      const invalidReport = {
        title: 'Broken sidewalk',
        description: 'There is a large crack in the sidewalk',
        photoFile: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        location: {
          lat: 91, // Invalid latitude
          lng: 2.3522,
        },
      };

      const result = reportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should fail when file size exceeds limit', () => {
      // Create a file larger than 10MB
      const largeData = new ArrayBuffer(11 * 1024 * 1024);
      const largeFile = new File([largeData], 'large.jpg', { type: 'image/jpeg' });

      const invalidReport = {
        title: 'Broken sidewalk',
        description: 'There is a large crack',
        photoFile: largeFile,
        location: {
          lat: 48.8566,
          lng: 2.3522,
        },
      };

      const result = reportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid image format', () => {
      const invalidReport = {
        title: 'Broken sidewalk',
        description: 'There is a large crack',
        photoFile: new File(['test'], 'photo.txt', { type: 'text/plain' }),
        location: {
          lat: 48.8566,
          lng: 2.3522,
        },
      };

      const result = reportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate a valid email and password', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email format', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should fail with password shorter than 6 characters', () => {
      const invalidLogin = {
        email: 'user@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should accept password with exactly 6 characters', () => {
      const validLogin = {
        email: 'user@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });
  });

  describe('messageSchema', () => {
    it('should validate a valid message', () => {
      const validMessage = {
        text: 'This is a valid message',
      };

      const result = messageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should fail when message is empty', () => {
      const invalidMessage = {
        text: '',
      };

      const result = messageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should fail when message exceeds 1000 characters', () => {
      const invalidMessage = {
        text: 'a'.repeat(1001),
      };

      const result = messageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should accept message with exactly 1000 characters', () => {
      const validMessage = {
        text: 'a'.repeat(1000),
      };

      const result = messageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });
  });
});
