"use client"
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { CountryList } from './countryData'

interface SelectCountryProps {
    value:string | undefined,
    onChange:(value:string)=>void;
    className:string
}

const SelectCountry:React.FC<SelectCountryProps> = ({value,onChange,className}) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={className}
                >
                    {value
                        ? CountryList.find((country) => country.name === value)?.name
                        : "Select Country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Country..." />
                    <CommandList>
                        <CommandEmpty>No Country found.</CommandEmpty>
                        <CommandGroup>
                            {CountryList.map((country) => (
                                <CommandItem
                                    key={country.name}
                                    value={country.name}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === country.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {country.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export default SelectCountry