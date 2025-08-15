import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, googleId, googleEmail } = await req.json();

    if (!email || !googleId || !googleEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db('Extensify').collection('users');

    // Find the existing user with credentials
    const existingUser = await users.findOne({ email: String(email).trim().toLowerCase() });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user to include Google account info
    await users.updateOne(
      { email: String(email).trim().toLowerCase() },
      {
        $set: {
          googleId,
          googleEmail: String(googleEmail).trim().toLowerCase(),
          linkedAccounts: {
            google: true,
            credentials: true,
          },
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Account linked successfully',
    });
  } catch (error) {
    console.error('Error linking account:', error);
    return NextResponse.json(
      { error: 'Failed to link account' },
      { status: 500 }
    );
  }
}
