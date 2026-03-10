import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { markOverdueActions } from './overdue';

export async function getSessionOrRedirect(){ await markOverdueActions(); const session = await auth(); if(!session?.user) redirect('/login'); return session; }

export async function scopedWhere(role:string, propertyId?:string|null){
  if(['central_manager','finance'].includes(role)) return {};
  return propertyId? {propertyId}: {};
}

export { prisma };
