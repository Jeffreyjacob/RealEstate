import { ApartmentType } from '@/lib/types'
import React from 'react'

interface MapPopOverProps {
    apartment:ApartmentType | null
}

const MapPopOver:React.FC<MapPopOverProps> = ({apartment}) => {
  return (
    <div className='text-[12px]'>
        {apartment?.title}
    </div>
  )
}

export default MapPopOver