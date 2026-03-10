import { compareSync } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { employee: true }
        });

        if (!user || !user.employee) return null;
        if (!compareSync(password, user.password)) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          employeeId: user.employeeId,
          role: user.employee.accessRole,
          propertyId: user.employee.propertyId
        };
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
      session.user = {
        ...session.user,
        id: token.id as string,
        employeeId: token.employeeId as string,
        role: token.role as string,
        propertyId: token.propertyId as string | null
      };
      return session;
    }
  }
});