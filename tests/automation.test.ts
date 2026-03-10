import { describe,it,expect } from 'vitest';
import { complaintActionType, nextActionPriority, unitStateForMaintenance } from '@/lib/automation';

describe('automation rules',()=>{
  it('maps maintenance complaints',()=>expect(complaintActionType('AC broken')).toBe('maintenance'));
  it('prioritizes urgent with near checkin',()=>expect(nextActionPriority(2)).toBe('urgent'));
  it('critical maintenance blocks unit',()=>expect(unitStateForMaintenance('critical').blocked).toBe(true));
});
