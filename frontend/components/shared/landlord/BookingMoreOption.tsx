"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis, ListCollapse, MessageCircleMore } from 'lucide-react'
import React from 'react'
import BookingDetail from './popover/BookingDetail'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BookingMoreOptionProps {
    bookingId: string,
    type: "userBooking" | 'landlordBooking',
    recipient:string
}

const BookingMoreOption: React.FC<BookingMoreOptionProps> = ({
    bookingId,
    type,
    recipient
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis className='text-[#475467] w-4 h-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className='flex gap-2 text-[13px]' asChild>
                    <BookingDetail bookingId={bookingId} type={type} />
                </DropdownMenuItem>
                <DropdownMenuItem className='flex text-[13px]' asChild>
                    <Link className='w-full flex gap-1  text-[13px] p-1 my-1 rounded-lg hover:bg-accent' href={`messages/${bookingId}?recipient=${recipient}`}>
                    <MessageCircleMore className='text-[#475467] w-4 h-4'  />
                        Send Message
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default BookingMoreOption