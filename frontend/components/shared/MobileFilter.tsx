import React, { ChangeEvent } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { Input } from '../ui/input'
import PriceSlider from './Slider/PriceSlider'
import { ApartmentSearchParams } from '@/app/(root)/Listing/page'
import { Checkbox } from '../ui/checkbox'


interface MobileFilterProps {
    searchParams:ApartmentSearchParams;
    changeLocation:(location:string)=>void
    changeCategory:(category:string)=>void
    changePriceMin:(e:ChangeEvent<HTMLInputElement>)=>void
    changePriceMax:(e:ChangeEvent<HTMLInputElement>)=>void
    categoryData:{
        name:string,
        value:string
    }[],
    changePrice:(event: Event, value: number | number[])=>void
}

const MobileFilter:React.FC<MobileFilterProps> = ({
    searchParams,
    changeCategory,
    changeLocation,
    changePriceMin,
    changePriceMax,
    categoryData,
    changePrice
}) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <SlidersHorizontal className='w-4 h-4 text-[#252C32]' />
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                       
                    </DrawerHeader>
                    <div className=" flex flex-col gap-y-5">
                        <div className='flex flex-col gap-y-2'>
                            <h3 className='text-[14px] text-[#252C32] font-semibold'>
                                Location
                            </h3>
                            <Input type='text' placeholder='location'
                                value={searchParams.location}
                                className='placeholder:text-[#667085]'
                                onChange={(e) => changeLocation(e.target.value)} />
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <h3 className='text-[14px] text-[#252C32] font-semibold'>
                                Budget
                            </h3>
                            <div className='w-full flex justify-between items-center'>
                                <Input className='w-[40%] placeholder:text-[#667085]' placeholder='Min'
                                    value={searchParams.price_min}
                                    onChange={changePriceMin} />

                                <Input className='w-[40%] placeholder:text-[#667085]' placeholder='Max'
                                    value={searchParams.price_max}
                                    onChange={changePriceMax} />
                            </div>
                            <div className='mt-3'>
                                <PriceSlider
                                    min={searchParams.price_min}
                                    max={searchParams.price_max}
                                    onChange={changePrice} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <h3 className='text-[14px] text-[#252C32] font-semibold'>
                                Category
                            </h3>

                            <div className='gap-y-4 grid grid-cols-2'>
                                {
                                    categoryData.map((category, index) => (
                                        <div className="flex items-center space-x-2" key={index}>
                                            <Checkbox id={category.value}
                                                className='bg-[#EFF8FF] text-primaryColor-900'
                                                checked={searchParams.category === category.value}
                                                onCheckedChange={() => changeCategory(category.value)}
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-[#484848] text-[12px] font-normal"
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    ))
                                }

                            </div>




                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileFilter