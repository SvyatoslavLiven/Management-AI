'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login(){
  const [email,setEmail]=useState('central@ops.local');
  const [password,setPassword]=useState('password123');
  const [error,setError]=useState('');
  const r=useRouter();
  return <main className='min-h-screen flex items-center justify-center'><form className='card w-96 space-y-3' onSubmit={async e=>{e.preventDefault();const res=await signIn('credentials',{email,password,redirect:false});if(res?.error) setError('Invalid credentials'); else r.push('/');}}><h1 className='text-xl font-semibold'>Sign In</h1><input className='border p-2 w-full' value={email} onChange={e=>setEmail(e.target.value)} /><input className='border p-2 w-full' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><button className='bg-slate-900 text-white px-3 py-2 rounded w-full'>Login</button>{error&&<p className='text-red-600 text-sm'>{error}</p>}</form></main>
}
