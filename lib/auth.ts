// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            return null
          }

          // Since we don't know your password verification method,
          // we'll assume you have a way to verify passwords elsewhere
          // Replace this with your actual password verification logic
          const isPasswordValid = await verifyPassword(credentials.password, user.email)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
  },
}

// Replace this function with your actual password verification logic
async function verifyPassword(password: string, email: string): Promise<boolean> {
  // This is a placeholder - implement your actual password verification logic
  // Example:
  // 1. Get the user's stored password hash from wherever it's stored
  // 2. Compare the provided password with the stored hash
  
  try {
    // If you're using a separate table for auth:
    const userPassword = await prisma.$queryRaw`
      SELECT password_hash FROM user_credentials WHERE user_email = ${email}
    `
    
    // If using bcrypt:
    // return await compare(password, userPassword.password_hash)
    
    // Temporary placeholder
    return password === 'password123' // Replace with actual verification
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}