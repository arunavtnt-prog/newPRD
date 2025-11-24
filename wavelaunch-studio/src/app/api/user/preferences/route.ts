/**
 * User Preferences API Route
 *
 * Handles notification preferences updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * PATCH /api/user/preferences
 * Update user notification preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notifyEmailApprovals, notifyEmailMentions, notifyEmailUpdates } =
      body;

    // Build update data
    const updateData: any = {};

    if (typeof notifyEmailApprovals === 'boolean') {
      updateData.notifyEmailApprovals = notifyEmailApprovals;
    }

    if (typeof notifyEmailMentions === 'boolean') {
      updateData.notifyEmailMentions = notifyEmailMentions;
    }

    if (typeof notifyEmailUpdates === 'boolean') {
      updateData.notifyEmailUpdates = notifyEmailUpdates;
    }

    // Update user preferences
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        notifyEmailApprovals: true,
        notifyEmailMentions: true,
        notifyEmailUpdates: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Preferences updated successfully',
        preferences: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
