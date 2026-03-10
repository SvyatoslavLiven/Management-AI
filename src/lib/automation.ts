import { EventType, Priority, Severity, ActionType, ReadinessStatus, MaintenanceStatus } from '@prisma/client';

export function dueHoursBySeverity(severity: Severity): number {
  if (severity === 'critical') return 1;
  if (severity === 'high') return 4;
  if (severity === 'medium') return 12;
  return 24;
}

export function complaintActionType(description: string): ActionType {
  return /ac|water|electric|repair|maintenance/i.test(description) ? 'maintenance' : 'guest_request';
}

export function nextActionPriority(nextCheckInHours: number | null): Priority {
  if (nextCheckInHours !== null && nextCheckInHours <= 6) return 'urgent';
  if (nextCheckInHours !== null && nextCheckInHours <= 24) return 'high';
  return 'normal';
}

export function unitStateForMaintenance(severity: Severity): { readiness: ReadinessStatus; maintenance: MaintenanceStatus; blocked: boolean } {
  if (severity === 'critical') return { readiness: 'not_ready', maintenance: 'out_of_order', blocked: true };
  if (severity === 'high') return { readiness: 'not_ready', maintenance: 'issue_open', blocked: false };
  return { readiness: 'inspection_needed', maintenance: 'warning', blocked: false };
}

export const AUTO_EVENT_TYPES: EventType[] = ['check_out', 'complaint', 'maintenance_issue', 'bad_review'];
