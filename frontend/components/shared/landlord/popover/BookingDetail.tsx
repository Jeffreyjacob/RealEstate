import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useGetBookingDetailsQuery } from '@/redux/features/bookingApislice'
import { format } from 'date-fns'
import { ListCollapse, Loader2 } from 'lucide-react'
import React from 'react'

interface BookingDetailProps {
    bookingId: string,
    type: string
}

const BookingDetail: React.FC<BookingDetailProps> = ({
    bookingId,
    type
}) => {
    const { data, isLoading } = useGetBookingDetailsQuery({ id: bookingId })
    return (
        <Dialog>
            <DialogTrigger className='w-full flex gap-1  text-[13px] p-1 my-1 rounded-lg hover:bg-accent'>
                <ListCollapse className='text-[#475467] w-4 h-4' />
                View details
            </DialogTrigger>
            <DialogContent className='w-full'>
                <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                </DialogHeader>
                <div>
                    {
                        isLoading ? (
                            <div className='w-full h-full flex justify-center items-center'>
                                <Loader2 className='w-4 h-4' />
                            </div>
                        ) : (
                            <div className='w-full flex flex-col gap-y-4'>
                                <div className='flex flex-col gap-1 mt-4'>
                                    <Label className='text-[14px] font-semibold text-neutral-B900'>Apartment Title</Label>
                                    <span className='text-[12px] font-medium text-neutral-B500'>
                                        {data?.apartment.title}
                                    </span>
                                </div>

                                <div className='flex flex-col gap-1 '>
                                    <Label className='text-[14px] font-semibold text-neutral-B900'>Date Booked</Label>
                                    <div className='w-full flex items-center gap-3'>
                                        <span className='text-[12px] font-medium text-neutral-B500'>
                                            From: {format(new Date(data?.start_date || ''), 'yyyy-MM-dd')}
                                        </span>  |
                                        <span className='text-[12px] font-medium text-neutral-B500'>
                                            To:{format(new Date(data?.end_date || ''), 'yyyy-MM-dd')}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <Label className='text-[14px] font-semibold text-neutral-B900'>Apartment Location</Label>
                                    <span className='text-[12px] font-medium text-neutral-B500'>
                                        {data?.apartment.location}
                                    </span>
                                </div>

                                {
                                    type === "landlordBooking" ? (
                                        <>
                                            <div className='flex flex-col gap-1'>
                                                <Label className='text-[14px] font-semibold text-neutral-B900'>Tenent Name</Label>
                                                <span className='text-[12px] font-medium text-neutral-B500'>
                                                    {data?.user.full_name}
                                                </span>
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <Label className='text-[14px] font-semibold text-neutral-B900'>Tenent Contact Info</Label>
                                                <span className='text-[12px] font-medium text-neutral-B500'>
                                                    {data?.user.email}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                          <div className='flex flex-col gap-1'>
                                                <Label className='text-[14px] font-semibold text-neutral-B900'>Landlord Name</Label>
                                                <span className='text-[12px] font-medium text-neutral-B500'>
                                                    {data?.apartment.user.full_name}
                                                </span>
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <Label className='text-[14px] font-semibold text-neutral-B900'>Landlord Contact Info</Label>
                                                <span className='text-[12px] font-medium text-neutral-B500'>
                                                    {data?.apartment.user.email}
                                                </span>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default BookingDetail