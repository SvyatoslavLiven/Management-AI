import { describe,it,expect } from 'vitest';
import { dueHoursBySeverity } from '@/lib/automation';
describe('critical server logic',()=>{it('critical severity due is shortest',()=>expect(dueHoursBySeverity('critical')).toBe(1));});
