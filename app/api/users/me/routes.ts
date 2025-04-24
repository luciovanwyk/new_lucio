// pages/api/users/me.ts
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          email: true,
          phoneNumber: true,
          streetAddress: true,
          suburb: true,
          townCity: true,
          postcode: true,
        },
      });

      return user ? res.status(200).json(user) : res.status(404).json({ error: 'User not found' });
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const data = req.body;
      
      if (!data.username || !data.email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }

      const [existingEmail, existingUsername] = await Promise.all([
        prisma.user.findUnique({ where: { email: data.email } }),
        prisma.user.findUnique({ where: { username: data.username } }),
      ]);

      if (existingEmail && existingEmail.id !== session.user.id) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      if (existingUsername && existingUsername.id !== session.user.id) {
        return res.status(409).json({ error: 'Username already taken' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          streetAddress: data.streetAddress,
          suburb: data.suburb,
          townCity: data.townCity,
          postcode: data.postcode,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          email: true,
          phoneNumber: true,
          streetAddress: true,
          suburb: true,
          townCity: true,
          postcode: true,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('PUT error:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}