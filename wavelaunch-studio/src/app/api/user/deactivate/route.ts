/**
 * User Deactivation API Route
 *
 * Handles account deactivation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * POST /api/user/deactivate
 * Deactivate user account
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent admins from deactivating themselves if they're the only admin
    if (session.user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: {
          role: 'ADMIN',
          isActive: true,
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error:
              'Cannot deactivate the last active admin account. Please assign another admin first.',
          },
          { status: 400 }
        );
      }
    }

    // Deactivate user account
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json(
      { message: 'Account deactivated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deactivating account:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate account' },
      { status: 500 }
    );
  }
}
