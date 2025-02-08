"use client"
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useChangeBookingStatusMutation, useLandlordBookingQuery } from '@/redux/features/bookingApislice'
import React, { useEffect, useState } from 'react'
import PaginationContainer from '../../Pagination/PaginationContainer'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { format } from 'date-fns'
import BookingMoreOption from '../BookingMoreOption'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { BookingListType } from '@/lib/types'
import { Button } from '@/components/ui/button'

const BookingList = () => {
  const { data, isLoading } = useLandlordBookingQuery()
  const [changeBookingStatus] = useChangeBookingStatusMutation()
  const [page, setPage] = useState<number>(1)
  const items_per_page = 10
  const total_Pages = Math.ceil((data?.count || 1) / items_per_page)
  const [status, setStatus] = useState<{[key:string]:string}>({})
  const onPageChange = (page: number) => {
    setPage(page)
  }

  const bookingStatusData = [
    { name: "Pending", value: "Pending" },
    { name: "Paid", value: "Paid" },
    { name: "Cancelled", value: "Cancelled" }
  ]
  const HandleChangeBookingStatus = async (status: string,id:string) => {
      try{
          const response = await changeBookingStatus({
             booking_status:status,
             id:id
          }).unwrap()
          setStatus((prevState)=>({
            ...prevState,
            [id]:status
          }))
          toast.success('Booking status updated!')
      }catch(error){
         console.log(error)
         toast.error('Something went wrong')
      }
  }

  useEffect(()=>{
    if (data?.results) {
      const initialStatus = data.results.reduce((acc: any, booking: BookingListType) => {
        acc[booking?.id] = booking.booking_status;
        return acc;
      }, {}); 
      setStatus(initialStatus);
    }
  },[data?.results])

  return (
    <div className='w-full h-full'>
      <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
        <div className='w-full flex justify-between items-center my-4'>
          <h3 className='text-[14px] font-semibold text-[##484848]'>Bookings</h3>
          <div className='flex flex-col md:flex-row gap-3'>
            {/* <Input type='text'
                    placeholder='Search...'
                    className='hidden md:block w-[250px]'
                    value={SearchTerm.search}
                    onChange={(e) => onSearchChange(e.target.value)}
                /> */}
          </div>
        </div>
        <div className='w-full my-3'>
          {/** visible search input for only small screen */}
          {/* <Input type='text'
                placeholder='Search...'
                className='md:hidden'
                value={SearchTerm.search}
                onChange={(e) => onSearchChange(e.target.value)} /> */}
        </div>
        <Table>
          <TableCaption>
            {
              (data?.count || 0) > 0 &&
              <PaginationContainer
                totalPage={total_Pages}
                onPageChange={onPageChange}
                currentPage={page}
              />

            }
          </TableCaption>
          <TableHeader>
            <TableRow className='text-[#484848] font-semibold'>
              <TableHead className="w-[150px] max-md:text-[12px]">Name</TableHead>
              <TableHead className='max-md:text-[12px] min-w-[70px]'>Price</TableHead>
              <TableHead className='max-md:text-[12px] min-w-[130px]'>Tenants</TableHead>
              <TableHead className='max-md:text-[12px] min-w-[200px]'>Location</TableHead>
              <TableHead className='max-md:text-[12px] min-w-[140px]'>Date Application</TableHead>
              <TableHead className='max-md:text-[12px]'>Status</TableHead>
              <TableHead className='max-md:text-[12px]'>More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isLoading ? <>
                {
                  [1, 2, 3, 4, 5, 6].map((skeleton, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={6}>
                        <Skeleton className='w-full h-[40px]  rounded-lg' />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </> :
                <>
                  {data?.results.map((booking, index) => (
                    <TableRow key={index} className='text-[#484848] font-normal'>
                      <TableCell className="max-md:text-[12px] min-w-[200px] ">
                        <div className='w-full flex gap-x-2 justify-start items-center'>
                          <Image src={booking.apartment.images[0]}
                            alt='apartment-image'
                            width={40} height={50}

                            className='rounded-md shadow-md '
                          />
                          <span>
                            {booking.apartment.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='max-md:text-[12px]'>
                        $ {booking.Total_price}
                      </TableCell>
                      <TableCell className='max-md:text-[12px]'>
                        {booking.user.full_name}
                      </TableCell>
                      <TableCell className='max-md:text-[12px] min-w-[150px] w-[290px]'>
                        {booking.apartment.location}
                      </TableCell>
                      <TableCell className='max-md:text-[12px]'>
                        {format(new Date(booking.created_at), 'yyyy-MM-dd')}
                      </TableCell>
                      <TableCell className='max-md:text-[12px]'>
                        <Select value={status[booking.id]}
                        onValueChange={(value)=>HandleChangeBookingStatus(value,booking.id)}>
                          <SelectTrigger className='w-[100px]'>
                            <SelectValue placeholder='booking status' />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              bookingStatusData.map((value, index) => (
                                <SelectItem key={index} value={value.value}>
                                  {value.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className='text-center'>
                        <BookingMoreOption bookingId={booking.id} 
                        type='landlordBooking'
                         recipient={booking.user.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
            }
          </TableBody>

        </Table>
      </Card>
    </div>
  )
}

export default BookingList