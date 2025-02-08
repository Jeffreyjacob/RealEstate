"use client"
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLandloardApartmentsQuery } from '@/redux/features/apartmentApislice'
import Image from 'next/image'
import React, { ChangeEvent, useState } from 'react'
import ApartmentOption from '../ApartmentOption'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PaginationContainer from '../../Pagination/PaginationContainer'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

type SearchTermType = {
    page: number,
    search: string,
    size: number
}


const PropertyManagement = () => {
    const router = useRouter()
    const [SearchTerm, setSearchTerm] = useState<SearchTermType>({
        page: 1,
        search: "",
        size: 10
    })
    const { data, isLoading } = useLandloardApartmentsQuery({
        title: SearchTerm.search,
        page: SearchTerm.page,
        size: SearchTerm.size
    })

    const total_Pages = Math.ceil((data?.count || 1) / SearchTerm.size)

    const onPageChangeHandler = (page: number) => {
        setSearchTerm((prevState) => ({
            ...prevState,
            page: page
        }))
    }

    const onSearchChange = (value: string) => {
        setSearchTerm((prevState) => ({
            ...prevState,
            search: value
        }))
    }
    
    return (
        <div>
            <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
                <div className='w-full flex justify-between items-center my-4'>
                    <h3 className='text-[14px] font-semibold text-[##484848]'>Apartments</h3>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Button className='max-md:text-[12px] bg-primaryColor-900 hover:bg-primaryColor-700 text-white  w-fit' onClick={() => router.push('landlordDashboard/createApartment')}>
                            Add Apartment
                        </Button>
                        <Input type='text'
                            placeholder='Search...'
                            className='hidden md:block w-[250px]'
                            value={SearchTerm.search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className='w-full my-3'>
                    {/** visible search input for only small screen */}
                    <Input type='text'
                        placeholder='Search...'
                        className='md:hidden'
                        value={SearchTerm.search}
                        onChange={(e) => onSearchChange(e.target.value)} />
                </div>
                <Table>
                    <TableCaption>
                        {
                            (data?.count || 0) > 0 && (
                                <PaginationContainer
                                    totalPage={total_Pages}
                                    onPageChange={onPageChangeHandler}
                                    currentPage={SearchTerm.page}
                                />
                            )
                        }
                    </TableCaption>
                    <TableHeader>
                        <TableRow className='text-[#484848] font-semibold'>
                            <TableHead className="w-[100px] max-md:text-[12px]">S/N</TableHead>
                            <TableHead className="w-[150px] max-md:text-[12px]">Name</TableHead>
                            <TableHead className='max-md:text-[12px]'>Category</TableHead>
                            <TableHead className='max-md:text-[12px] min-w-[150px]'>Date Published</TableHead>
                            <TableHead className='max-md:text-[12px]'>Price</TableHead>
                            <TableHead className='max-md:text-[12px] min-w-[150px]'>Location</TableHead>
                            <TableHead className='max-md:text-[12px]'>action</TableHead>
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
                                    {data?.results.map((apartment, index) => (
                                        <TableRow key={index} className='text-[#484848] font-normal'>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="max-md:text-[12px] min-w-[200px] ">
                                                <div className='w-full flex gap-x-2 justify-start items-center'>
                                                    <Image src={apartment.images[1]}
                                                        alt='apartment-image'
                                                        width={40} height={50}

                                                        className='rounded-md shadow-md '
                                                    />
                                                    <span>
                                                        {apartment.title}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='max-md:text-[12px]'>{apartment.category}</TableCell>
                                            <TableCell className='max-md:text-[12px]'>
                                                {format(new Date(apartment.created_at), 'yyyy-MM-dd')}
                                            </TableCell>
                                            <TableCell className='max-md:text-[12px]'> ${apartment.price}</TableCell>
                                            <TableCell className='max-md:text-[12px] min-w-[150px] w-[290px]'>{apartment.location}</TableCell>
                                            <TableCell className='text-center'>
                                                <ApartmentOption id={apartment.id} />
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

export default PropertyManagement