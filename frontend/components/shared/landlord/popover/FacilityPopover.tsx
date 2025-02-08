import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import React, { useState } from 'react'

interface FacilityPopoverProps {
    value: string[];
    onChange: (value: string[]) => void
}

const FacilityPopover: React.FC<FacilityPopoverProps> = ({
    value,
    onChange
}) => {

    const [open, setOpen] = useState(false)
    const facilities = [
        { name: 'fitness center' },
        { name: 'Free parking' },
        { name: 'Airport shuttle' },
        { name: 'Free Wifi' },
        { name: 'Outdoor swimming pool' },
        { name: 'indoor swimming pool' },
        { name: 'Family room' },
        { name: 'Washer and Dryer' },
        { name: 'Iron and Ironing Board' },
        { name: 'Hot Water' },
        { name: 'Private Cinema' },
        { name: 'Jacuzzi or Hot Tub' },
        {name:'Pets allowed'},
        {name:'Tv'},
        {name:"Kitchen"},
        {name:"Moutain view"},
        {name:"Ocean view"}
    ]

    const onFaciliyChange = (currentValue: string) => {
        const existingFacility = value.includes(currentValue)

        if (existingFacility) {
            const updatedValue = value.filter((facility) => facility !== currentValue)
            onChange(updatedValue)
        } else {
            const updatedValue = [...value, currentValue]
            onChange(updatedValue)
        }
    }
    console.log(value)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild >
                <div className='w-full flex justify-between items-center border-[1px] shadow-md p-2 rounded-lg'>
                    <div className='w-[93%] flex gap-3 flex-wrap'>
                        {
                            value?.map((facility, index) => (
                                <div
                                    key={index}
                                    className='text-[11px] leading-3 p-2 rounded-lg bg-[#EFF8FF] text-primaryColor-900 w-fit flex gap-3'>
                                    {facility}
                                    <X className='w-3 h-3 text-primaryColor-900 cursor-pointer' 
                                    onClick={()=>onFaciliyChange(facility)}/>
                                </div>
                            ))
                        }
                    </div>
                    <Button
                        type="button"
                        role='combobox'
                        aria-expanded={open}
                        className='bg-[#D0D5DD] rounded-lg p-1 w-[7%] '>
                        <Plus className='w-3 h-3' />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0"
                onClick={(e) => e.stopPropagation()}>
                <Command>
                    <CommandInput placeholder="Search Facilities" />
                    <CommandList>
                        <CommandEmpty>No facility found.</CommandEmpty>
                        <CommandGroup>
                            {facilities.map((facility, index) => (
                                <CommandItem
                                    key={index}
                                    value={facility.name}
                                    onSelect={(currentValue) => onFaciliyChange(currentValue)}
                                    className=' cursor-pointer'>
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.includes(facility.name) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {facility.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default FacilityPopover