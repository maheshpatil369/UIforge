"use client"
import React from 'react'
import Image from 'next/image'
import { SignInButton, UserButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

export const Header = () => {
  const{user}=useUser();   
  return (
    <div>
      <div className='flex items-center justify-between p-3'>
        <div className='flex gap-2 items-center'>
        <Image src="/logoui.png" alt="Logo" width={60} height={60} />
        <h2 className='text-xl font-semibold'>UI/UX MOCK</h2>
        </div>
<ul className='flex gap-5 items-center text-lg'>
    <li className='hover:text-primary cursor-pointer'>Home</li>
    <li className='hover:text-primary cursor-pointer'>Pricing</li>
</ul>
<>
  <SignedOut>
    <SignInButton mode='modal'> 
      <button className='bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all font-medium cursor-pointer'>
        Get Started
      </button>
    </SignInButton>
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</>
      </div>
    </div>
  )
}
