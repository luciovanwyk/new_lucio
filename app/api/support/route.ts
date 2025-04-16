import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adjust path if needed

export async function POST(request: Request) {
  try {
    const { name, email, title, message, userId } = await request.json();

    // Validate required fields
    if (!name || !email || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database
    const supportMessage = await prisma.supportMessage.create({
      data: {
        name,
        email,
        title,
        message,
        userId: userId || null,
      },
    });

    return NextResponse.json({ message: 'Support message received successfully!', supportMessage }, { status: 200 });
  } catch (error) {
    console.error('Error processing support message:', error);
    return NextResponse.json({ error: 'Failed to process support message' }, { status: 500 });
  }
}
