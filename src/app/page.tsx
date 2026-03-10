import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { prisma } from '@/lib/db';

export default async function Dashboard(){
  const session = await auth();
  if(!session?.user) redirect('/login');
  const propertyFilter = session.user.propertyId ? { propertyId: session.user.propertyId } : {};
  const [props,arrivals,departures,notReady,overdue,critical,activity] = await Promise.all([
    prisma.property.count({where: session.user.role==='central_manager'||session.user.role==='finance'?{}:propertyFilter}),
    prisma.booking.count({where:{...propertyFilter,checkInDate:{gte:new Date(new Date().setHours(0,0,0,0)),lte:new Date(new Date().setHours(23,59,59,999))}}}),
    prisma.booking.count({where:{...propertyFilter,checkOutDate:{gte:new Date(new Date().setHours(0,0,0,0)),lte:new Date(new Date().setHours(23,59,59,999))}}}),
    prisma.unit.count({where:{...propertyFilter,readinessStatus:{not:'ready'}}}),
    prisma.action.count({where:{...propertyFilter,status:'overdue'}}),
    prisma.event.count({where:{...propertyFilter,severity:'critical',status:{in:['open','in_review','action_created']}}}),
    prisma.activityLog.findMany({take:8,orderBy:{createdAt:'desc'}})
  ]);
  return <main className='flex'><Sidebar/><section className='flex-1'><Topbar name={session.user.name} role={session.user.role}/><div className='p-4 grid grid-cols-3 gap-3'>{[['Properties',props],['Arrivals',arrivals],['Departures',departures],['Units not ready',notReady],['Overdue actions',overdue],['Critical events',critical]].map(([k,v])=><div className='card' key={k as string}><div className='text-sm text-slate-500'>{k as string}</div><div className='text-2xl font-semibold'>{v as number}</div></div>)}</div><div className='p-4'><div className='card'><h2 className='font-semibold mb-2'>Recent Activity</h2>{activity.map(a=><div key={a.id} className='text-sm border-b py-1'>{a.actionType} {a.entityType} {a.entityId}</div>)}</div></div></section></main>
}
