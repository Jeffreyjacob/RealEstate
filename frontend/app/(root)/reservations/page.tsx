"use client"
import React, { useState } from 'react'
import ProtectedRoutes from '../ProtectedRoutes'
import { useUserBookingQuery } from '@/redux/features/bookingApislice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PaginationContainer from '@/components/shared/Pagination/PaginationContainer'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { format } from 'date-fns'
import BookingMoreOption from '@/components/shared/landlord/BookingMoreOption'

const Page = () => {
  const [searchParam, setSearchParam] = useState<{ title: string, page: number }>({
    title: '',
    page: 1
  })
  const { data, isLoading } = useUserBookingQuery({
    title: searchParam.title,
    page: searchParam.page
  })

  const handleTitleChange = (title: string) => {
    setSearchParam((prevState) => ({
      ...prevState,
      title: title
    }))
  }

  const handlePageChange = (page: number) => {
    setSearchParam((prevState) => ({
      ...prevState,
      page: page
    }))
  }

  const items_per_page = 10

  const total_Pages = Math.ceil((data?.count || 1) / items_per_page)
  console.log(data)


  return (
    <ProtectedRoutes>
      <div className='w-full max-w-6xl flex flex-col xl:flex-row  max-xl:px-8 my-10 mx-auto'>
        <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
          <div className='w-full flex justify-between items-center my-4'>
            <h3 className='text-[14px] font-semibold text-[##484848]'>Reservations</h3>
            <div className='flex flex-col md:flex-row gap-3'>
              <Input type='text'
                placeholder='Search title...'
                className='hidden md:block w-[250px]'
                value={searchParam.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full my-3'>
            {/** visible search input for only small screen */}
            <Input type='text'
              placeholder='Search title...'
              className='md:hidden'
              value={searchParam.title}
              onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <Table>
            <TableCaption>
              {
                (data?.count || 0) > 0 && (
                  <PaginationContainer
                    totalPage={total_Pages}
                    onPageChange={handlePageChange}
                    currentPage={searchParam.page}
                  />
                )
              }
            </TableCaption>
            <TableHeader>
              <TableRow className='text-[#484848] font-semibold'>
                <TableHead className="w-[100px] max-md:text-[12px]">S/N</TableHead>
                <TableHead className="w-[150px] max-md:text-[12px]">Apartment</TableHead>
                <TableHead className='max-md:text-[12px]'>Price</TableHead>
                <TableHead className='max-md:text-[12px]'>Landlord</TableHead>
                <TableHead className='max-md:text-[12px] min-w-[150px] text-center'>Application Date</TableHead>
                <TableHead className='max-md:text-[12px] text-center'>Status</TableHead>
                <TableHead className='max-md:text-[12px] text-center'>More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                data?.results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className='w-full h-full flex justify-center items-center '>
                        <p className='text-[14px] text-center'>No Reservations Available</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
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
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="max-md:text-[12px] min-w-[350px] ">
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
                              <TableCell className='max-md:text-[12px]'>${booking.Total_price}</TableCell>
                              <TableCell className='max-md:text-[12px]'>{booking.apartment.user.full_name}</TableCell>
                              <TableCell className='max-md:text-[12px] text-center'>
                                {format(new Date(booking.created_at), 'yyyy-MM-dd')}
                              </TableCell>
                              <TableCell className='max-md:text-[12px] text-center'>{booking.booking_status}</TableCell>
                              <TableCell className='text-center'>
                                <BookingMoreOption bookingId={booking.id}
                                 type='userBooking'
                                 recipient={booking.apartment.user.id.toString()} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                    }
                  </>
                )
              }
            </TableBody>

          </Table>
        </Card>
      </div>
    </ProtectedRoutes>
  )
}

export default Page