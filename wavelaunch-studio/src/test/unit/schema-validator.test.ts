/**
 * Tests for Schema Validation Utilities
 */

import { describe, it, expect } from 'vitest';
import * as validator from '@/lib/validation/schema-validator';

describe('schema-validator', () => {
  describe('Field Constants', () => {
    it('should have correct USER_FIELDS', () => {
      expect(validator.USER_FIELDS).toContain('id');
      expect(validator.USER_FIELDS).toContain('email');
      expect(validator.USER_FIELDS).toContain('fullName');
      expect(validator.USER_FIELDS).toContain('role');
      expect(validator.USER_FIELDS).toContain('companyName');
      expect(validator.USER_FIELDS).toContain('emailVerified');
      expect(validator.USER_FIELDS).toContain('passwordResetToken');
      
      // Should NOT contain invalid fields
      expect(validator.USER_FIELDS).not.toContain('creatorEmail');
    });

    it('should have correct PROJECT_FIELDS', () => {
      expect(validator.PROJECT_FIELDS).toContain('id');
      expect(validator.PROJECT_FIELDS).toContain('projectName');
      expect(validator.PROJECT_FIELDS).toContain('creatorName');
      expect(validator.PROJECT_FIELDS).toContain('status');
      expect(validator.PROJECT_FIELDS).toContain('leadStrategistId');
      
      // Should NOT contain invalid fields
      expect(validator.PROJECT_FIELDS).not.toContain('creatorEmail');
    });

    it('should have correct ACTIVITY_FIELDS', () => {
      expect(validator.ACTIVITY_FIELDS).toContain('id');
      expect(validator.ACTIVITY_FIELDS).toContain('actionType');
      expect(validator.ACTIVITY_FIELDS).toContain('actionDescription');
      expect(validator.ACTIVITY_FIELDS).toContain('projectId');
      expect(validator.ACTIVITY_FIELDS).toContain('userId');
      
      // Should NOT contain wrong field names
      expect(validator.ACTIVITY_FIELDS).not.toContain('action');
      expect(validator.ACTIVITY_FIELDS).not.toContain('description');
    });

    it('should have correct USER_ROLES', () => {
      expect(validator.USER_ROLES).toEqual(['ADMIN', 'TEAM_MEMBER', 'CREATOR']);
      expect(validator.USER_ROLES).not.toContain('CLIENT');
    });

    it('should have correct PROJECT_STATUSES', () => {
      expect(validator.PROJECT_STATUSES).toContain('ONBOARDING');
      expect(validator.PROJECT_STATUSES).toContain('DISCOVERY');
      expect(validator.PROJECT_STATUSES).toContain('COMPLETED');
      expect(validator.PROJECT_STATUSES).toContain('ARCHIVED');
    });
  });

  describe('validateField', () => {
    it('should validate User fields correctly', () => {
      expect(validator.validateField('User', 'email')).toBe(true);
      expect(validator.validateField('User', 'fullName')).toBe(true);
      expect(validator.validateField('User', 'role')).toBe(true);
      expect(validator.validateField('User', 'companyName')).toBe(true);
    });

    it('should reject invalid User fields', () => {
      expect(validator.validateField('User', 'creatorEmail')).toBe(false);
      expect(validator.validateField('User', 'invalidField')).toBe(false);
    });

    it('should validate Project fields correctly', () => {
      expect(validator.validateField('Project', 'projectName')).toBe(true);
      expect(validator.validateField('Project', 'creatorName')).toBe(true);
      expect(validator.validateField('Project', 'status')).toBe(true);
      expect(validator.validateField('Project', 'leadStrategistId')).toBe(true);
    });

    it('should reject invalid Project fields', () => {
      expect(validator.validateField('Project', 'creatorEmail')).toBe(false);
      expect(validator.validateField('Project', 'owner')).toBe(false);
    });

    it('should validate Activity fields correctly', () => {
      expect(validator.validateField('Activity', 'actionType')).toBe(true);
      expect(validator.validateField('Activity', 'actionDescription')).toBe(true);
      expect(validator.validateField('Activity', 'projectId')).toBe(true);
    });

    it('should reject invalid Activity fields', () => {
      expect(validator.validateField('Activity', 'action')).toBe(false);
      expect(validator.validateField('Activity', 'description')).toBe(false);
    });
  });

  describe('getFieldValidationError', () => {
    it('should return descriptive error message', () => {
      const error = validator.getFieldValidationError('User', 'creatorEmail');
      
      expect(error).toContain('Invalid field');
      expect(error).toContain('creatorEmail');
      expect(error).toContain('User');
      expect(error).toContain('Prisma schema');
    });
  });

  describe('isValidRole', () => {
    it('should validate correct roles', () => {
      expect(validator.isValidRole('ADMIN')).toBe(true);
      expect(validator.isValidRole('TEAM_MEMBER')).toBe(true);
      expect(validator.isValidRole('CREATOR')).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(validator.isValidRole('CLIENT')).toBe(false);
      expect(validator.isValidRole('INVALID')).toBe(false);
      expect(validator.isValidRole('admin')).toBe(false); // Case-sensitive
      expect(validator.isValidRole('')).toBe(false);
    });
  });

  describe('isValidProjectStatus', () => {
    it('should validate correct statuses', () => {
      expect(validator.isValidProjectStatus('ONBOARDING')).toBe(true);
      expect(validator.isValidProjectStatus('DISCOVERY')).toBe(true);
      expect(validator.isValidProjectStatus('COMPLETED')).toBe(true);
      expect(validator.isValidProjectStatus('ARCHIVED')).toBe(true);
    });

    it('should reject invalid statuses', () => {
      expect(validator.isValidProjectStatus('INVALID')).toBe(false);
      expect(validator.isValidProjectStatus('completed')).toBe(false); // Case-sensitive
      expect(validator.isValidProjectStatus('')).toBe(false);
    });
  });

  describe('QUERY_FIXES', () => {
    it('should document common mistakes', () => {
      expect(validator.QUERY_FIXES['where: { creatorEmail: ... }']).toBeDefined();
      expect(validator.QUERY_FIXES['actionType vs action']).toBeDefined();
      expect(validator.QUERY_FIXES['role: "CLIENT"']).toBeDefined();
    });

    it('should provide correct fixes', () => {
      const creatorEmailFix = validator.QUERY_FIXES['where: { creatorEmail: ... }'];
      expect(creatorEmailFix).toContain('team');
      expect(creatorEmailFix).toContain('user');
      expect(creatorEmailFix).toContain('email');

      const roleFix = validator.QUERY_FIXES['role: "CLIENT"'];
      expect(roleFix).toContain('CREATOR');
    });
  });

  describe('RELATIONS', () => {
    it('should have correct User relations', () => {
      expect(validator.RELATIONS.User.projectMemberships).toBe('projectMemberships');
      expect(validator.RELATIONS.User.sentMessages).toBe('sentMessages');
      expect(validator.RELATIONS.User.receivedMessages).toBe('receivedMessages');
      expect(validator.RELATIONS.User.activities).toBe('activities');
    });

    it('should have correct Project relations', () => {
      expect(validator.RELATIONS.Project.phases).toBe('phases');
      expect(validator.RELATIONS.Project.team).toBe('team');
      expect(validator.RELATIONS.Project.files).toBe('files');
      expect(validator.RELATIONS.Project.leadStrategist).toBe('leadStrategist');
    });

    it('should have correct Activity relations', () => {
      expect(validator.RELATIONS.Activity.user).toBe('user');
      expect(validator.RELATIONS.Activity.project).toBe('project');
    });
  });

  describe('Error Prevention', () => {
    it('should prevent creatorEmail field usage', () => {
      // This test demonstrates the error prevention system
      const isValid = validator.validateField('Project', 'creatorEmail');
      expect(isValid).toBe(false);
      
      const error = validator.getFieldValidationError('Project', 'creatorEmail');
      expect(error).toBeDefined();
    });

    it('should prevent CLIENT role usage', () => {
      expect(validator.isValidRole('CLIENT')).toBe(false);
      
      const fix = validator.QUERY_FIXES['role: "CLIENT"'];
      expect(fix).toContain('CREATOR');
    });

    it('should prevent action field usage', () => {
      const isValid = validator.validateField('Activity', 'action');
      expect(isValid).toBe(false);
      
      const fix = validator.QUERY_FIXES['actionType vs action'];
      expect(fix).toContain('actionType');
    });

    it('should prevent description field usage in Activity', () => {
      const isValid = validator.validateField('Activity', 'description');
      expect(isValid).toBe(false);
      
      const fix = validator.QUERY_FIXES['actionDescription vs description'];
      expect(fix).toContain('actionDescription');
    });
  });
});
