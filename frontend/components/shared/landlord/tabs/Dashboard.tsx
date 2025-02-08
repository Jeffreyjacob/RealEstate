"use client"
import { Card } from '@/components/ui/card'
import { useLandLordStatisticsQuery } from '@/redux/features/bookingApislice'
import { useAppSelector } from '@/redux/store'
import { BadgeDollarSign, House } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ListingMap from '../../Maps/ListingMap'
import { ApartmentType } from '@/lib/types'

const Dashboard = () => {
  const { data, isLoading } = useLandLordStatisticsQuery()
  const user = useAppSelector((state) => state.user.userInfo)
  const [apartments,setApartments] = useState<ApartmentType[]>([])

  useEffect(()=>{
     if(data?.booked_apartment){
        const apartment = data.booked_apartment.map((booking)=>booking.apartment)
        setApartments(apartment) 
     }
  },[data])
  console.log(data)
  return (
    <div className='w-full h-full flex flex-col gap-5 mx-1'>
      <div className='mt-5'>
        <h2 className='text-[20px] lg:text-[30px] text-[#484848] font-semibold'>
          Welcome back, {user?.full_name}
        </h2>
        <p className='text-[12px] lg:text-[16px] text-[#6C6B6B] font-normal'>
          Track, manage and forecast your properties
        </p>
      </div>
      <div className='w-full grid grid-cols-3 mt-6 gap-x-4'>
        <Card className='w-full p-3 lg:p-5 flex flex-col gap-y-5 lg:gap-y-6'>
          <div className='w-full flex justify-between items-center'>
            <p className='text-[#484848] font-semibold text-[11px] lg:text-[16px]'>
              Amount Recieved
            </p>
            <BadgeDollarSign className='w-4 h-4 text-[#484848]' />
          </div>
          <p className='text-[#484848] text-[20px] lg:text-[30px] font-semibold'>
            {data?.total_amount}
          </p>
        </Card>
        <Card className='w-full p-3 lg:p-5 flex flex-col gap-y-5 lg:gap-y-6'>
          <div className='w-full flex justify-between items-center'>
            <p className='text-[#484848] font-semibold text-[11px] lg:text-[16px]'>
              Booked Apartments
            </p>
            <House className='w-4 h-4 text-[#484848]' />
          </div>
          <p className='text-[#484848] text-[20px] lg:text-[30px] font-semibold'>
            {data?.booked_apartment.length}
          </p>
        </Card>
        <Card className='w-full p-3 lg:p-5 flex flex-col gap-y-5 lg:gap-y-6'>
          <div className='w-full flex justify-between items-center'>
            <p className='text-[#484848] font-semibold text-[11px] lg:text-[16px]'>
              Cancelled Apartments
            </p>
            <House className='w-4 h-4 text-[#484848]' />
          </div>
          <p className='text-[#484848] text-[20px] lg:text-[30px] font-semibold'>
            {data?.cancelled_apartment.length}
          </p>
        </Card>
      </div>

      <div className='mt-5'>
        <ListingMap data={apartments}/>
      </div>
    </div>
  )
}

export default Dashboard