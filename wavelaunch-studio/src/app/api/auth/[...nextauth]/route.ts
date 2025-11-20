/**
 * NextAuth.js API Route Handler
 *
 * This handles all authentication requests
 * Endpoint: /api/auth/*
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
