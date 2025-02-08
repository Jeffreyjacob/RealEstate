import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ApartmentDetailSkeleton = () => {
    return (
        <div className='w-full h-full flex flex-col gap-10'>
            <div className='w-full flex flex-col lg:flex-row max-lg:gap-y-7 lg:gap-x-4 xl:gap-x-7 '>
                {/**Left side */}
                <div className='w-full lg:w-8/12 flex flex-col gap-y-4'>
                <AspectRatio ratio={16 / 9}>
                <Skeleton className='w-full h-full rounded-lg'/>
                </AspectRatio>
                <Skeleton className='w-full h-[200px] rounded-lg'/>
                </div>
                {/**Right side */}
                <div className='w-full lg:w-1/3 flex flex-col gap-y-5'>
                  <Skeleton className='w-full h-[350px] rounded-lg'/>
                  <Skeleton className='w-full h-[26px]'/>
                </div>
            </div>
        </div>
    )
}

export default ApartmentDetailSkeleton