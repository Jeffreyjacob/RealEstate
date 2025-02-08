"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis, Pen, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import DeleteApartmentPopover from './popover/DeleteApartmentPopover'

interface ApartmentOptionProps {
    id:string
}

const ApartmentOption:React.FC<ApartmentOptionProps> = ({
    id
}) => {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
             <Ellipsis className='text-[#475467] w-4 h-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className='flex gap-2 text-[13px]' onClick={()=>router.push(`/landlordDashboard/editApartment?id=${id}`)}>
                   <Pen  className='text-[#475467] w-4 h-4'/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className='flex gap-2 text-[13px]' asChild>
                    <DeleteApartmentPopover id={id}/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default ApartmentOption