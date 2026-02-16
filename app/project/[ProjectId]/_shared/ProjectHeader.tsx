import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToogle';
import { SignedIn, UserButton } from '@clerk/nextjs';

// Add progress and loading to Props type
type Props = {
  progress?: number;
  loading?: boolean;
};

const ProjectHeader = ({ progress = 0, loading }: Props) => {
  return (
    <div>
      <div className='flex items-center justify-between p-1.5 shadow-sm'>
        
        <div className='flex gap-2 items-center'>
          <Image src="/logoui.png" alt="Logo" width={60} height={60} />
          <h2 className='text-xl font-semibold'>UI/UX MOCK</h2>
        </div>

        <div className="flex items-center gap-4">
          {loading && (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-blue-600 animate-pulse">
                AI Forge: {progress}%
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button className='bg-red-600 hover:bg-red-500'>
            Save {progress === 100 && <span className="text-[10px] text-green-600">●</span>}
          </Button>
          <SignedIn>
  <div className="flex items-center gap-4">
    <ThemeToggle />
    <UserButton />
  </div>
</SignedIn>
        </div>

      </div>
    </div>
  )
}

export default ProjectHeader
