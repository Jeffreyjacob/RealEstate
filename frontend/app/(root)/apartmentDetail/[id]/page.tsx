"use client"
import Apartment from '@/components/shared/Apartment/Apartment'
import DatePicker from '@/components/shared/Calender/DatePicker'
import CheckOutButton from '@/components/shared/Checkbutton/CheckOutButton'
import ProperityMap from '@/components/shared/Maps/ProperityMap'
import ApartmentDetailSkeleton from '@/components/shared/Skeletons/ApartmentDetailSkeleton'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useGetApartmentByIdQuery, useGetRelatedApartmentQuery } from '@/redux/features/apartmentApislice'
import { useApartmentBookingQuery } from '@/redux/features/bookingApislice'
import { useAppSelector } from '@/redux/store'
import { differenceInDays, eachDayOfInterval } from 'date-fns'
import { ArrowDown, Loader2, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Range } from 'react-date-range'

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const Page = () => {
    const { id } = useParams()
    const { data, isLoading } = useGetApartmentByIdQuery({
        id: id as string
    })
    const { isAuthenticated } = useAppSelector((state) => state.user)
    const router = useRouter()
    const pathName = usePathname()
    const [selectImage, setSelectImage] = useState<string>('')
    const [showDescription, setShowDescription] = useState(false)
    const [dataRange, setDataRange] = useState<Range>(initialDateRange)
    const [night, setNight] = useState<number>(1)
    const [TotalPrice, setTotalPrice] = useState<number>(1)
    const [fee, setFee] = useState<number>(0)
    const guestRange = Array.from({ length: data?.guest || 0 }, (_, index) => index + 1)
    const [selectedGuest, setSelectedGuest] = useState('')
    const { data: relatedApartment, isLoading: relatedApartmentLoading } = useGetRelatedApartmentQuery({
        id: id as string
    })
    const {data:apartmentBooking} = useApartmentBookingQuery({id:id as string})
    const [bookedDates,setBookedDates] = useState<Date[]>([])
    useEffect(() => {
        if (data) {
            if (data.images.length > 0) {
                setSelectImage(data.images[0])
            }
        }
    }, [data])

    const _setDataRange = (selection: any) => {
        const newStartDate = new Date(selection.startDate)
        const newEndDate = new Date(selection.endDate)

        if (newEndDate < newStartDate) {
            newEndDate.setDate(newStartDate.getDate() + 1)
        }

        setDataRange({
            ...dataRange,
            startDate: newStartDate,
            endDate: newEndDate
        })
    }

    useEffect(() => {
        if (data && dataRange.startDate && dataRange.endDate) {
            const daysCount = differenceInDays(
                dataRange.endDate,
                dataRange.startDate
            )

            if (daysCount && data.price) {
                const _fee = ((daysCount * parseInt(data.price)) / 100) * 5
                setFee(_fee)
                setNight(daysCount)
                setTotalPrice((daysCount * parseInt(data.price)) + _fee)
            } else if (data.price) {
                const _fee = ((parseInt(data.price)) / 100) * 5
                setFee(_fee)
                setNight(1)
                setTotalPrice(parseInt(data.price) + _fee)
            }
        }

    }, [dataRange, data])
    console.log(apartmentBooking)
    useEffect(()=>{
      if(apartmentBooking){
          const allbookedDate:Date[] = apartmentBooking.flatMap((booking)=>{
             return eachDayOfInterval({
                start:new Date(booking.start_date),
                end:new Date(booking.end_date)
             })
          })
          setBookedDates(allbookedDate)
      }
    },[apartmentBooking])
    return (
        <div className='w-full max-w-5xl mx-auto flex flex-col max-xl:px-8 mt-10 justify-center items-center'>
            {
                isLoading ? (
                    <ApartmentDetailSkeleton />
                ) : (
                    <div className='w-full h-full flex flex-col gap-10'>
                        <div className='w-full flex flex-col lg:flex-row max-lg:gap-y-7 lg:gap-x-4 xl:gap-x-7 '>
                            {/**left side */}
                            <div className='w-full lg:w-8/12 flex flex-col gap-y-4'>
                                <AspectRatio ratio={16 / 9}>
                                    <Image src={selectImage}
                                        alt='apartment'
                                        className='rounded-md transition-all duration-300'
                                        layout='fill'
                                    />
                                </AspectRatio>
                                <ScrollArea className='mt-2'>
                                    <div className='flex gap-x-3 w-[70px] h-[70px] my-2 mx-2'>
                                        {
                                            data?.images.map((image, index) => (
                                                <Image src={image}
                                                    key={index}
                                                    alt='apartment-image'
                                                    layout='responsive'
                                                    width={70}
                                                    height={70}
                                                    className={cn('rounded-md', {
                                                        ' outline outline-4 outline-gray-400': selectImage === image
                                                    })}
                                                    onClick={() => setSelectImage(image)}
                                                />
                                            ))
                                        }
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                                {/**Title and price */}
                                <div className='w-full flex justify-between items-center mt-4'>
                                    <h3 className='text-[#484848] text-[20px] md:text-[26px] font-bold'>{data?.title}</h3>
                                    <div className='flex gap-1 items-center'>
                                        <span className='text-[#484848] font-semibold text-[17px] md:text-[22px]'>$ {data?.price}</span>
                                        <span className='text-[14px] md:text-[18px] text-[#484848] font-normal'>/ night</span>
                                    </div>
                                </div>
                                {/**Location */}
                                <h3 className='text-[#6C6B6B] text-[13px] font-normal flex gap-1 items-start md:items-center'>
                                    <MapPin className='text-[#6C6B6B]' />
                                    {data?.location}
                                </h3>

                                {/**Feature */}
                                <div className='flex gap-1 text-[12px]'>
                                    <span className='w-fit p-2 bg-[#EFF8FF] text-primaryColor-900 font-semibold rounded-full'>
                                        {data?.bedrooms} bedrooms
                                    </span>
                                    <span className='w-fit p-2 bg-[#EFF8FF] text-primaryColor-900 font-semibold rounded-full'>
                                        {data?.bathroom} bathrooms
                                    </span>
                                    <span className='w-fit p-2 bg-[#EFF8FF] text-primaryColor-900 font-semibold rounded-full '>
                                        {data?.category}
                                    </span>
                                </div>
                                {/**Description */}
                                <div className='flex gap-y-2 px-4 py-4 flex-col border-[1px] rounded-lg shadow-sm transition-all duration-300'>
                                    <h3 className='text-[#484848] text-[16px] font-semibold'>Description</h3>
                                    <p className={cn('text-[13px] font-normal text-[#484848]', {
                                        ' line-clamp-4': !showDescription
                                    })}>
                                        {data?.description}
                                    </p>
                                    <button className='w-fit bg-[#EFF8FF] text-primaryColor-900 font-semibold text-[13px] p-2 rounded-xl flex gap-1 items-center' onClick={() => setShowDescription(!showDescription)}>
                                        {showDescription ? 'Show less' : 'Show More'}
                                        <ArrowDown className='text-primaryColor-900 w-3 h-3' />
                                    </button>
                                </div>

                                {/** Facilties*/}
                                <div className='flex gap-y-2 px-4 py-4 flex-col border-[1px] rounded-lg shadow-sm'>
                                    <h3 className='text-[#484848] text-[16px] font-semibold'>Facilties</h3>
                                    <div className='flex gap-1'>
                                        {
                                            data?.facilities.map((facility, index) => (
                                                <div key={index} className='bg-[#667085]/20 text-[#344054] text-[12px] font-normal w-fit p-2 rounded-2xl'>
                                                    {facility}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                            {/**right side */}
                            <div className='w-full lg:w-1/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1'>
                                {/**Date picker */}
                                <div>
                                    <h2 className='text-[#484848] text-[16px] font-semibold mb-3'>Pick Your Booking Date</h2>
                                    <DatePicker
                                        value={dataRange}
                                        onChange={(value) => _setDataRange(value.selection)}
                                        bookedDate={bookedDates}
                                    />
                                </div>

                                {/**Map location of apartment */}
                                <div>
                                    <h2 className='text-[#484848] text-[16px] font-semibold mb-3'>Location</h2>
                                    <ProperityMap address={data?.location || ''} />
                                </div>

                                {/**Guest */}
                                <div className='max-md:mt-5 max-w-[330px]'>
                                    <h2 className='text-[#484848] text-[16px] font-semibold mb-3 '>Select Number of Guest</h2>
                                    <Select value={selectedGuest} onValueChange={setSelectedGuest}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select number of guests" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                guestRange.map((value, index) => (
                                                    <SelectItem key={index} value={value.toString()}>
                                                        {value}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/**Booking */}
                                <div className='max-md:mt-5'>
                                    <h2 className='text-[#484848] text-[16px] font-semibold mb-3'>Checkout</h2>
                                    <Card className='w-full h-[200px] text-[#484848] p-4'>
                                        <div className='mb-4 flex justify-between items-center text-[13px]'>
                                            <p>$ {data?.price} * {night} nights</p>
                                            <p>${parseInt(data?.price || '0') * night}</p>
                                        </div>
                                        <div className='mb-4 flex justify-between items-center text-[13px]'>
                                            <p>Airbnb fee</p>
                                            <p>${fee}</p>
                                        </div>
                                        <Separator />
                                        <div className='mt-4 flex justify-between items-center font-bold text-[14px]'>
                                            <p>Total</p>
                                            <p>${TotalPrice}</p>
                                        </div>
                                        {
                                            isAuthenticated ? (
                                              <CheckOutButton
                                               apartment_id={data?.id || ''}
                                               start_date={dataRange.startDate}
                                               end_date={dataRange.endDate}
                                               guest={selectedGuest}
                                               nights={night}
                                               apartmentLandlordId={data?.user.id || 0}
                                               />
                                            ) :
                                                (
                                                    <Button className='bg-primaryColor-900 hover:bg-primaryColor-700 w-full mt-5' onClick={()=>router.push(`/login?redirect=${pathName}`)}>
                                                        Book
                                                    </Button>
                                                )
                                        }
                                    </Card>
                                </div>
                            </div>
                        </div>

                        {/**related apartments */}
                        <div>
                            <h2 className='text-[#484848] font-semibold text-[18px]'>Similar Apartments</h2>
                            <div className='my-5 grid md:grid-cols-2 lg:grid-cols-3 gap-y-7 justify-items-center gap-x-4 mt-10'>
                                {
                                    relatedApartment?.slice(0, 3).map((apartment, index) => (
                                        <Apartment data={apartment} key={index} pageTye='RelatedApartment' id={id as string} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Page