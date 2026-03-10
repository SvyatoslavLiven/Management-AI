import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import { compareSync } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string }, include: { employee: true } });
        if (!user) return null;
        if (!compareSync(credentials.password as string, user.password)) return null;
        return { id: user.id, email: user.email, name: user.name, employeeId: user.employeeId, role: user.employee.accessRole, propertyId: user.employee.propertyId };
      }
    })
  ],
  pages: { signIn: '/login' },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) Object.assign(token, user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = { ...session.user, id: token.id as string, employeeId: token.employeeId as string, role: token.role as string, propertyId: token.propertyId as string | null };
      return session;
    }
  }
});
