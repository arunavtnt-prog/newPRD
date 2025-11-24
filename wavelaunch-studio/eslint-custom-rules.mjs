/**
 * Custom ESLint Rules for WaveLaunch Studio
 *
 * Catches common schema-related errors before they reach production
 */

export default {
  rules: {
    /**
     * Prevent using non-existent 'CLIENT' role
     */
    'no-client-role': {
      meta: {
        type: 'error',
        docs: {
          description: 'Prevent using CLIENT role (should be CREATOR)',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          Literal(node) {
            if (node.value === 'CLIENT') {
              context.report({
                node,
                message: 'Use "CREATOR" instead of "CLIENT" role',
                fix(fixer) {
                  return fixer.replaceText(node, '"CREATOR"');
                },
              });
            }
          },
        };
      },
    },

    /**
     * Prevent using creatorEmail field (doesn't exist in schema)
     */
    'no-creator-email-field': {
      meta: {
        type: 'error',
        docs: {
          description: 'Prevent using non-existent creatorEmail field',
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            if (node.property.name === 'creatorEmail') {
              context.report({
                node,
                message:
                  'Field "creatorEmail" does not exist. Use project.team relationship to access user emails.',
              });
            }
          },
          Property(node) {
            if (node.key.name === 'creatorEmail') {
              context.report({
                node,
                message:
                  'Field "creatorEmail" does not exist in Project model. Use team relationship.',
              });
            }
          },
        };
      },
    },

    /**
     * Prevent using wrong Activity field names
     */
    'correct-activity-fields': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce correct Activity field names',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          MemberExpression(node) {
            // Check for .action (should be .actionType)
            if (node.property.name === 'action' && node.object.name !== 'form') {
              context.report({
                node,
                message: 'Use "actionType" instead of "action" for Activity model',
                fix(fixer) {
                  return fixer.replaceText(node.property, 'actionType');
                },
              });
            }
            // Check for .entity or .description (should be .actionDescription)
            if (
              (node.property.name === 'entity' || node.property.name === 'description') &&
              context.getAncestors().some((ancestor) => ancestor.type === 'Activity')
            ) {
              context.report({
                node,
                message: 'Use "actionDescription" for Activity model',
              });
            }
          },
        };
      },
    },

    /**
     * Prevent hardcoded redirects without role check
     */
    'role-based-redirects': {
      meta: {
        type: 'warning',
        docs: {
          description: 'Enforce role-based redirects',
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            // Check for router.push with hardcoded dashboard paths
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.property.name === 'push' &&
              node.arguments.length > 0
            ) {
              const arg = node.arguments[0];
              if (
                arg.type === 'Literal' &&
                (arg.value === '/dashboard' || arg.value === '/client/dashboard')
              ) {
                context.report({
                  node,
                  message:
                    'Avoid hardcoded dashboard redirects. Use getRedirectPathForRole() helper.',
                });
              }
            }
          },
        };
      },
    },

    /**
     * Ensure @/lib/db is used instead of @/lib/prisma
     */
    'use-lib-db-import': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce using @/lib/db for prisma imports',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value === '@/lib/prisma') {
              context.report({
                node,
                message: 'Import from "@/lib/db" instead of "@/lib/prisma"',
                fix(fixer) {
                  return fixer.replaceText(node.source, '"@/lib/db"');
                },
              });
            }
          },
        };
      },
    },
  },
};
