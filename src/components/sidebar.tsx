import Link from 'next/link';
const links = ['dashboard','properties','units','guests','bookings','events','actions','employees','shifts','reports','approvals','owner'];
export function Sidebar(){return <aside className='w-56 bg-slate-900 text-slate-100 min-h-screen p-4'><h1 className='font-bold mb-4'>Ops Bali MVP</h1><nav className='space-y-2'>{links.map(l=><Link className='block hover:text-white capitalize' key={l} href={l==='dashboard'?'/':`/${l}`}>{l}</Link>)}</nav></aside>;}
