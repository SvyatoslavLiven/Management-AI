import { describe,it,expect } from 'vitest';
import { canAccessProperty, canMutateAction } from '@/lib/rbac';

describe('rbac',()=>{
  it('line staff cannot cross property',()=>expect(canAccessProperty({id:'1',employeeId:'e1',role:'line_staff' as any,propertyId:'p1'},'p2')).toBe(false));
  it('line staff can mutate own action',()=>expect(canMutateAction({id:'1',employeeId:'e1',role:'line_staff' as any,propertyId:'p1'},'e1','p1')).toBe(true));
});
