"use client"
import ListingMap from '@/components/shared/Maps/ListingMap'
import { Input } from '@/components/ui/input'
import { useSearchApartmentQuery } from '@/redux/features/apartmentApislice'
import React, { ChangeEvent, useState } from 'react'
import PriceSlider from '@/components/shared/Slider/PriceSlider'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowDown } from 'lucide-react'
import SelectButton from '@/components/shared/SelectButton'
import MobileFilter from '@/components/shared/MobileFilter'
import Apartment from '@/components/shared/Apartment/Apartment'
import ApartmentSkeleton from '@/components/shared/Skeletons/ApartmentSkeleton'
import PaginationContainer from '@/components/shared/Pagination/PaginationContainer'

export interface ApartmentSearchParams {
  location: string,
  category: string,
  price_min: number,
  price_max: number,
  page:number
}


const Page = () => {
  const [searchParam, setSearchParam] = useState<ApartmentSearchParams>({
    location: '',
    category: '',
    price_min: 0,
    price_max: 1000,
    page:1
  })
  const [showFullCategory, setShowFullCategory] = useState(false)
  const [sortType, setSortType] = useState('')

  const { data, isLoading, isError } = useSearchApartmentQuery({
    location: searchParam.location,
    category: searchParam.category,
    price_min: searchParam.price_min,
    price_max: searchParam.price_max,
    page:searchParam.page
  })

  const items_per_page = 9
  const totalPage = Math.ceil((data?.count || 1) / items_per_page)

  const handleChangeLocation = (location: string) => {
    setSearchParam((prevState) => ({
      ...prevState,
      location: location
    }))
  }

  const handlePriceMin = (e: ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value
    setSearchParam((prevState) => ({
      ...prevState,
      price_min: parseFloat(price)
    }))
  }

  const handlePriceMax = (e: ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value
    setSearchParam((prevState) => ({
      ...prevState,
      price_max: parseFloat(price)
    }))
  }

  const changePrice = (event: Event, value: number | number[]) => {

    if (Array.isArray(value)) {
      setSearchParam((prevState) => ({
        ...prevState,
        price_min: value[0],
        price_max: value[1]
      }))
    }
  }

  const HandleChangeCategory = (category: string) => {
    setSearchParam((prevState) => ({
      ...prevState,
      category: category
    }))
  }

  const HandleChangePage = (page:number)=>{
      setSearchParam((prevState)=>({
        ...prevState,
        page:page
      }))
  }

  const categoryData = [
    { name: 'Room', value: 'Room' },
    { name: "Apartment", value: "Apartment" },
    { name: "Cabin", value: "Cabin" },
    { name: "Beach House", value: "Beach House" },
    { name: "Mansion", value: "Mansion" },
    { name: "CountrySide", value: "CountrySide" },
    { name: "Lake House", value: "Lake House" },
    { name: "Castle", value: "Castle" },
    { name: "Camper", value: "Camper" },
  ]

  const sortData = [
    { name: "oldest", value: 'oldest' },
    { name: 'newest', value: 'newest' }
  ]

  console.log(data)
  console.log(searchParam)
  return (
    <div className='w-full max-w-6xl flex flex-col xl:flex-row  max-xl:px-8 my-10 mx-auto'>
      {/**Left side */}
      <div className='w-full lg:w-[15%] mx-5 my-5 hidden xl:flex lg:flex-col  gap-y-5'>
        <div className='flex flex-col gap-y-2'>
          <h3 className='text-[14px] text-[#252C32] font-semibold'>
            Location
          </h3>
          <Input type='text' placeholder='location'
            value={searchParam.location}
            className='placeholder:text-[#667085]'
            onChange={(e) => handleChangeLocation(e.target.value)} />
        </div>

        <div className='flex flex-col gap-y-2'>
          <h3 className='text-[14px] text-[#252C32] font-semibold'>
            Budget
          </h3>
          <div className='w-full flex justify-between items-center'>
            <Input className='w-[40%] placeholder:text-[#667085]' placeholder='Min'
              value={searchParam.price_min}
              onChange={handlePriceMin} />

            <Input className='w-[40%] placeholder:text-[#667085]' placeholder='Max'
              value={searchParam.price_max}
              onChange={handlePriceMax} />
          </div>
          <div className='mt-3'>
            <PriceSlider
              min={searchParam.price_min}
              max={searchParam.price_max}
              onChange={changePrice} />
          </div>
        </div>

        <div className='flex flex-col gap-y-2'>
          <h3 className='text-[14px] text-[#252C32] font-semibold'>
            Category
          </h3>

          <div className='flex flex-col gap-y-4'>
            {
              categoryData.slice(0, showFullCategory ? 8 : 4).map((category, index) => (
                <div className="flex items-center space-x-2 transition-all duration-300" key={index}>
                  <Checkbox id={category.value}
                    className='bg-[#EFF8FF] text-primaryColor-900'
                    checked={searchParam.category === category.value}
                    onCheckedChange={() => HandleChangeCategory(category.value)}
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

            <button className='w-fit bg-[#EFF8FF] text-primaryColor-900 font-semibold text-[13px] p-2 rounded-xl flex gap-1 items-center' onClick={() => setShowFullCategory(!showFullCategory)}>
              {showFullCategory ? 'Show less' : 'Show More'}
              <ArrowDown className='text-primaryColor-900 w-3 h-3' />
            </button>

          </div>




        </div>

      </div>
      <div className='w-full lg:w-[85%] lg:mx-5 my-5 flex flex-col gap-y-8'>
        {/**map */}
        <div>
          <ListingMap data={data?.results} />
        </div>
        {/**Apartment listing */}
        <div>
          <div className='w-full flex justify-between items-center'>
            <span className='text-[#252C32] text-[14px] font-normal'>
              {data?.results.length} Apartment
            </span>

            <div className='flex gap-x-3 items-center'>
              <div className='xl:hidden'>
                <MobileFilter searchParams={searchParam}
                  changeCategory={HandleChangeCategory}
                  changeLocation={handleChangeLocation} changePrice={changePrice}
                  changePriceMax={handlePriceMax} changePriceMin={handlePriceMin}
                  categoryData={categoryData} />
              </div>
              <SelectButton value={sortType}
                onChange={setSortType}
                placeholder='Sortby'
                className='w-[140px]'
                data={sortData}
              />
            </div>

          </div>
          <div className='my-5 grid md:grid-cols-2 lg:grid-cols-3 gap-y-7 justify-items-center gap-x-4 mt-7'>
            {
              isLoading ? (
                <ApartmentSkeleton />
              ) : (
                <>
                  {
                    data?.results.map((apartment, index) => (
                      <Apartment data={apartment} key={index} />
                    ))
                  }
                </>
              )
            }
          </div>
          {/**Pagination */}
          {
            data?.results.length != 0 && (
              <div className='w-full flex flex-col justify-center items-center mt-10'>
                 <PaginationContainer 
                    currentPage={searchParam.page}
                    totalPage={totalPage}
                    onPageChange={HandleChangePage}
                 />
              </div>
            )
          }


        </div>
      </div>
    </div>
  )
}

export default Page