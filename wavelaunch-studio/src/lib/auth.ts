/**
 * NextAuth.js Configuration
 *
 * This file configures authentication for Wavelaunch Studio
 * with role-based access control (RBAC).
 */

import NextAuth, { type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'ADMIN' | 'TEAM_MEMBER' | 'CREATOR';
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    role: 'ADMIN' | 'TEAM_MEMBER' | 'CREATOR';
    email: string;
    name: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'TEAM_MEMBER' | 'CREATOR';
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/auth/v2/login',
    error: '/auth/v2/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role as 'ADMIN' | 'TEAM_MEMBER' | 'CREATOR',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

/**
 * Helper to check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Helper to get current session on server
 */
export async function getSession() {
  return await auth();
}

/**
 * Helper to require authentication
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Helper to require specific role
 */
export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  if (!hasRole(session.user.role, roles)) {
    throw new Error('Forbidden');
  }
  return session;
}
