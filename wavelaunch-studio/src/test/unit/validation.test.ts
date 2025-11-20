/**
 * Validation Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  required,
  email,
  minLength,
  maxLength,
  url,
  phoneNumber,
  passwordStrength,
} from '@/lib/validation';

describe('Validation Utilities', () => {
  describe('required', () => {
    it('returns error for empty string', () => {
      const result = required('')('Field');
      expect(result).toBe('Field is required');
    });

    it('returns error for whitespace only', () => {
      const result = required('   ')('Field');
      expect(result).toBe('Field is required');
    });

    it('returns empty string for valid input', () => {
      const result = required('test')('Field');
      expect(result).toBe('');
    });
  });

  describe('email', () => {
    it('validates correct email', () => {
      const result = email('user@example.com');
      expect(result).toBe('');
    });

    it('rejects invalid email', () => {
      const result = email('invalid');
      expect(result).toBe('Must be a valid email address');
    });

    it('rejects email without domain', () => {
      const result = email('user@');
      expect(result).toBe('Must be a valid email address');
    });

    it('rejects email without @', () => {
      const result = email('userexample.com');
      expect(result).toBe('Must be a valid email address');
    });
  });

  describe('minLength', () => {
    it('validates string meeting minimum length', () => {
      const validator = minLength(5);
      const result = validator('hello');
      expect(result).toBe('');
    });

    it('rejects string below minimum length', () => {
      const validator = minLength(5);
      const result = validator('hi');
      expect(result).toBe('Must be at least 5 characters');
    });
  });

  describe('maxLength', () => {
    it('validates string within maximum length', () => {
      const validator = maxLength(10);
      const result = validator('hello');
      expect(result).toBe('');
    });

    it('rejects string exceeding maximum length', () => {
      const validator = maxLength(5);
      const result = validator('hello world');
      expect(result).toBe('Must be no more than 5 characters');
    });
  });

  describe('url', () => {
    it('validates correct HTTP URL', () => {
      const result = url('http://example.com');
      expect(result).toBe('');
    });

    it('validates correct HTTPS URL', () => {
      const result = url('https://example.com');
      expect(result).toBe('');
    });

    it('rejects invalid URL', () => {
      const result = url('not a url');
      expect(result).toBe('Must be a valid URL');
    });
  });

  describe('phoneNumber', () => {
    it('validates US phone number', () => {
      const result = phoneNumber('(123) 456-7890');
      expect(result).toBe('');
    });

    it('validates international format', () => {
      const result = phoneNumber('+1 123 456 7890');
      expect(result).toBe('');
    });

    it('rejects invalid phone number', () => {
      const result = phoneNumber('123');
      expect(result).toBe('Must be a valid phone number');
    });
  });

  describe('passwordStrength', () => {
    it('validates strong password', () => {
      const result = passwordStrength('Test123!@#');
      expect(result).toBe('');
    });

    it('rejects password without uppercase', () => {
      const result = passwordStrength('test123!@#');
      expect(result).toContain('uppercase');
    });

    it('rejects password without lowercase', () => {
      const result = passwordStrength('TEST123!@#');
      expect(result).toContain('lowercase');
    });

    it('rejects password without number', () => {
      const result = passwordStrength('TestTest!@#');
      expect(result).toContain('number');
    });

    it('rejects password without special char', () => {
      const result = passwordStrength('Test1234');
      expect(result).toContain('special character');
    });

    it('rejects short password', () => {
      const result = passwordStrength('Te1!');
      expect(result).toContain('8 characters');
    });
  });
});
