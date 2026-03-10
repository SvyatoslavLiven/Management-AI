import { AccessRole } from '@prisma/client';

export type SessionUser = { id: string; employeeId: string; role: AccessRole; propertyId?: string | null };

export function canAccessProperty(user: SessionUser, propertyId: string): boolean {
  if (user.role === 'central_manager' || user.role === 'finance') return true;
  if (user.role === 'owner' || user.role === 'property_manager' || user.role === 'department_head' || user.role === 'line_staff') {
    return user.propertyId === propertyId;
  }
  return false;
}

export function canMutateAction(user: SessionUser, assignedEmployeeId: string, propertyId: string): boolean {
  if (!canAccessProperty(user, propertyId)) return false;
  if (['central_manager', 'property_manager', 'department_head'].includes(user.role)) return true;
  return user.role === 'line_staff' && user.employeeId === assignedEmployeeId;
}

export function canApprove(user: SessionUser): boolean {
  return ['central_manager', 'finance', 'property_manager'].includes(user.role);
}
