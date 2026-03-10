import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { canMutateAction } from '@/lib/rbac';

export async function POST(_:Request,{params}:{params:{id:string}}){
  const session=await auth(); if(!session?.user) return NextResponse.json({error:'unauthorized'},{status:401});
  const action=await prisma.action.findUniqueOrThrow({where:{id:params.id}});
  const ok=canMutateAction({id:session.user.id,employeeId:session.user.employeeId,role:session.user.role as any,propertyId:session.user.propertyId},action.assignedToEmployeeId,action.propertyId);
  if(!ok) return NextResponse.json({error:'forbidden'},{status:403});
  const updated=await prisma.action.update({where:{id:action.id},data:{status:action.requiresApproval?'waiting':'done',completedAt:new Date(),approvalStatus:action.requiresApproval?'pending':action.approvalStatus}});
  await prisma.activityLog.create({data:{employeeId:session.user.employeeId,entityType:'Action',entityId:action.id,actionType:'complete',oldValue:action as any,newValue:updated as any}});
  return NextResponse.json(updated);
}
