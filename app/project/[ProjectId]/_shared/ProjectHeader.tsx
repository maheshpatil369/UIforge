import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const ProjectHeader = () => {
  return (
    <div>
        <div className='flex items-center justify-between p-1.5 shadow-sm'>
                 <div className='flex gap-2 items-center'>
                       <Image src="/logoui.png" alt="Logo" width={60} height={60} />
                       <h2 className='text-xl font-semibold'>UI/UX MOCK</h2>
                       </div>
                <Button className='bg-red-600 hover:bg-red-500'>Save </Button>
                </div>
      
    </div>
  )
}

export default ProjectHeader
