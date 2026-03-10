import 'next-auth';
declare module 'next-auth' {
  interface Session { user: { id: string; employeeId: string; role: string; propertyId: string | null; name?: string | null; email?: string | null } }
}
declare module 'next-auth/jwt' {
  interface JWT { id: string; employeeId: string; role: string; propertyId: string | null }
}
