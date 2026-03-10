import { prisma } from '@/lib/db';
export async function markOverdueActions(){
  await prisma.action.updateMany({where:{status:{in:['new','assigned','in_progress','waiting']},dueAt:{lt:new Date()}},data:{status:'overdue'}});
}
