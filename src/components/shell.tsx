import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
export function Shell({children,user}:{children:React.ReactNode;user:{name?:string|null;role?:string}}){return <main className='flex'><Sidebar/><section className='flex-1'><Topbar name={user.name} role={user.role}/><div className='p-4'>{children}</div></section></main>;}
