import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToogle'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { Pause, Play, XCircle } from 'lucide-react'

// Extended Props (non-breaking)
type Props = {
  progress?: number
  loading?: boolean

  // NEW (optional)
  isPaused?: boolean
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

const ProjectHeader = ({
  progress = 0,
  loading,
  isPaused = false,
  onPause,
  onResume,
  onCancel,
}: Props) => {
  return (
    <div>
      <div className='flex items-center justify-between p-1.5 shadow-sm'>

        {/* Left */}
        <div className='flex gap-2 items-center'>
          <Image src="/logoui.png" alt="Logo" width={60} height={60} />
          <h2 className='text-xl font-semibold'>UI/UX MOCK</h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

 {/* Progress / Completed Status */}
{loading ? (
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
) : progress === 100 ? (
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
      ● Generation Completed
    </span>

    {/* <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border"> */}
      {/* <div className="h-full bg-green-500 w-full" /> */}
    </div>
  // </div>
) : null}


          {/* 🆕 Pause / Resume / Cancel */}
          {loading && (
            <div className="flex items-center gap-2">
              {!isPaused ? (
                <Button
                  onClick={onPause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black flex gap-1 items-center"
                  size="sm"
                >
                  <Pause size={14} />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={onResume}
                  className="bg-green-600 hover:bg-green-700 text-white flex gap-1 items-center"
                  size="sm"
                >
                  <Play size={14} />
                  Resume
                </Button>
              )}

              <Button
                onClick={onCancel}
                className="bg-red-600 hover:bg-red-700 text-white flex gap-1 items-center"
                size="sm"
              >
                <XCircle size={14} />
                Cancel
              </Button>
            </div>
          )}

          {/* Save */}
          <Button className='bg-red-600 hover:bg-red-500'>
            Save {progress === 100 && (
              <span className="text-[10px] text-green-600 ml-1"> ●</span>
            )}
          </Button>

          {/* User */}
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
