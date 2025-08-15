import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CustomExtensifyAdapter } from '@/lib/custom-extensify-adapter';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db('Extensify');

          const normalizedEmail = credentials.email.toLowerCase();

          // Find user by email
          const user = await db.collection('users').findOne({
            email: normalizedEmail,
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object (password is excluded by NextAuth)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          } as any;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  adapter: CustomExtensifyAdapter(),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image as any;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = (token as any).image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};



