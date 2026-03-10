import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { canAccessProperty } from '@/lib/rbac';
import { complaintActionType, dueHoursBySeverity, nextActionPriority, unitStateForMaintenance } from '@/lib/automation';

const schema = z.object({ propertyId:z.string(), unitId:z.string().nullable().optional(), guestId:z.string().nullable().optional(), bookingId:z.string().nullable().optional(), type:z.enum(['check_in','check_out','early_check_in','late_check_out','complaint','maintenance_issue','inspection','accident','overdue','budget_deviation','bad_review','staff_absence','urgent_purchase']), severity:z.enum(['low','medium','high','critical']), source:z.string(), title:z.string(), description:z.string() });

export async function POST(req:Request){
  const session = await auth(); if(!session?.user) return NextResponse.json({error:'unauthorized'},{status:401});
  const data = schema.parse(await req.json());
  if(!canAccessProperty({id:session.user.id,employeeId:session.user.employeeId,role:session.user.role as any,propertyId:session.user.propertyId},data.propertyId)) return NextResponse.json({error:'forbidden'},{status:403});
  const event = await prisma.event.create({data:{...data,occurredAt:new Date(),detectedAt:new Date(),status:'open',createdByEmployeeId:session.user.employeeId}});
  const defaultAssignee = await prisma.employee.findFirst({where:{propertyId:data.propertyId,accessRole:{in:['department_head','line_staff']}}});
  const actions:any[]=[];
  if(data.type==='check_out' && data.unitId){
    const nextBooking = await prisma.booking.findFirst({where:{unitId:data.unitId,checkInDate:{gt:new Date()}},orderBy:{checkInDate:'asc'}});
    const hours = nextBooking ? (nextBooking.checkInDate.getTime()-Date.now())/36e5 : null;
    const priority = nextActionPriority(hours);
    actions.push({type:'housekeeping',title:'Post check-out housekeeping',priority},{type:'quality_check',title:'Post check-out quality check',priority});
    await prisma.unit.update({where:{id:data.unitId},data:{readinessStatus:'in_preparation'}});
  }
  if(data.type==='complaint') actions.push({type:complaintActionType(data.description),title:`Complaint response: ${data.title}`,priority:data.severity==='critical'?'urgent':'high'});
  if(data.type==='maintenance_issue' && data.unitId){
    actions.push({type:'maintenance',title:`Maintenance issue: ${data.title}`,priority:data.severity==='critical'?'urgent':'high'});
    const state=unitStateForMaintenance(data.severity);await prisma.unit.update({where:{id:data.unitId},data:{readinessStatus:state.readiness,maintenanceStatus:state.maintenance,bookingBlocked:state.blocked}});
  }
  if(data.type==='bad_review') actions.push({type:'quality_check',title:`Bad review follow-up: ${data.title}`,priority:'high'});
  await prisma.$transaction(actions.map(a=>prisma.action.create({data:{propertyId:data.propertyId,unitId:data.unitId ?? undefined,eventId:event.id,assignedToEmployeeId:defaultAssignee?.id ?? session.user.employeeId,type:a.type,priority:a.priority,title:a.title,description:data.description,dueAt:new Date(Date.now()+dueHoursBySeverity(data.severity)*36e5),status:'assigned'}})));
  await prisma.activityLog.create({data:{employeeId:session.user.employeeId,entityType:'Event',entityId:event.id,actionType:'create',newValue:event as any}});
  return NextResponse.json(event);
}
