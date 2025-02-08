"use client"
import { BadgeCheck, Plus } from 'lucide-react'
import Image from 'next/image'
import HeroImage1 from '@/assets/hero_Image1.png'
import HeroImage2 from '@/assets/hero_image2.png'
import { useGetAllApartmentsQuery } from '@/redux/features/apartmentApislice'
import Apartment from '@/components/shared/Apartment/Apartment'
import ApartmentSkeleton from '@/components/shared/Skeletons/ApartmentSkeleton'
import { ReservationProcess } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const AboutUs = [
    { name: "Professional Team" },
    { name: "Always in touch" },
    { name: "Verified Rooms" },
    { name: "Fast and Secure Booking" },
  ]
  const { data, isLoading: apartmentLoading } = useGetAllApartmentsQuery()
  return (
    <div>
      <main className='w-full max-w-5xl mx-auto flex flex-col max-xl:px-8 gap-16'>

        {/**Hero Image */}
        <div className='flex flex-col-reverse md:flex-row gap-10'>
          <div className=' flex flex-col w-full md:w-1/2 justify-center items-start'>
            <h2 className=' text-primaryColor-900 font-semibold text-[30px] md:text-[30px] lg:text-[40px] '>
              Find Your Future
            </h2>
            <h2 className=' text-[#1D2939] font-semibold text-[30px] md:text-[30px] lg:text-[40px] '>
              Dream Accommodation
            </h2>
            <span className='text-[14px] md:text-[16px] lg:text-[18px] text-[#484848] font-normal mt-2'>
              Want to find an accommodation? We are ready to help you find one that suits your lifestyle and needs.
            </span>

            <div className='flex justify-between items-center mt-6 w-full'>
              <div className='flex flex-col '>
                <span className='text-[#344054] text-[30px] font-semibold flex gap-1 w-full relative items-center'>
                  4235
                  <Plus className='text-[#1171B9] w-5 h-5' />
                </span>
                <p className='text-[#6C6B6B] text-[14px] font-normal text-center'>
                  Rooms
                </p>
              </div>

              <div className='flex flex-col '>
                <span className='text-[#344054] text-[30px] font-semibold flex gap-1 w-full relative items-center'>
                  535
                  <Plus className='text-[#1171B9] w-5 h-5' />
                </span>
                <p className='text-[#6C6B6B] text-[14px] font-normal text-center'>
                  Reservations
                </p>
              </div>


              <div className='flex flex-col '>
                <span className='text-[#344054] text-[30px] font-semibold flex gap-1 w-full relative items-center'>
                  19905
                  <Plus className='text-[#1171B9] w-5 h-5' />
                </span>
                <p className='text-[#6C6B6B] text-[14px] font-normal text-center'>
                  Students
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col w-full md:w-1/2 '>
            <Image
              src={HeroImage1}
              alt='hero_image1'
              layout='responsive'
              width={1000}
              height={550}
              objectFit='cover'
              className=' rounded-lg '
            />
          </div>
        </div>

        {/**Hero 2 */}
        <div className='flex flex-col md:flex-row md:gap-10'>
          <div className='w-full md:w-1/3'>
            <Image
              src={HeroImage2}
              layout='responsive'
              width={1000}
              height={400}
              objectFit='cover'
              alt='hero_image2'
              className=' rounded-lg'
            />
          </div>
          <div className='w-full md:w-8/12 md:mx-5 lg:mx-10 max-md:mt-8'>
            <h2 className='text-[28px] font-bold text-[#1D2939] '>We Help Students Find Their Perfect Home</h2>
            <h2 className=' text-primaryColor-900 text-[20px] font-semibold'>About Us</h2>
            <p className='text-[14px] text-[#344054] font-normal pt-6'>
              Erasmus Life Housing is your go-to hub for finding the perfect home for students, by students. Since 2013, our team has helped tons of students discover their ideal place. We’ve got a wide selection of student-friendly rooms, all built and managed just for you. <br />
              Our ultimate goal is to make Lisbon the number one destination for International Students and Young Workers, and we most surely don’t want that your experience finding accommodation to be a negative point of that experience!
            </p>

            <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-y-4 mt-5'>
              {
                AboutUs.map((link, index) => (
                  <div key={index} className='text-primaryColor-800 bg-[#8DA0E2] p-2 rounded-2xl w-fit text-[12px] md:text-[14px]  flex gap-1 items-center bg-opacity-25'>
                    <BadgeCheck className=' text-primaryColor-800 w-3 h-3' />
                    {link.name}
                  </div>
                ))
              }
            </div>
          </div>

        </div>

        {/**Apartment listing */}

        <div>
          <h2 className='text-[#1D2939] text-[28px] font-bold text-center md:text-start'>Reserve The Finest Room</h2>
          <div className='my-5 grid md:grid-cols-2 lg:grid-cols-3 gap-y-7 justify-items-center gap-x-4 mt-10'>
            {
              apartmentLoading ? (
                <>
                  {
                    [1, 2, 3, 4, 5, 6].map((skeleton) => (
                      <ApartmentSkeleton key={skeleton} />
                    ))
                  }
                </>
              ) : (
                <>
                  {
                    data?.results.slice(0, 6).map((data, index) => (
                      <Apartment key={index} data={data}/>
                    ))
                  }
                </>
              )
            }
          </div>
        </div>

        {/**Reservation process */}

        <div>
          <h2 className='text-center text-primaryColor-900 font-semibold text-[18px]'>Reservation Process</h2>
          <h3 className='text-[25px] text-[#1D2939] font-bold  text-center mt-2'>Fast, intuitive and absolutely safe !</h3>
          <div className='w-full grid  md:grid-cols-2 lg:grid-cols-4 max-lg:gap-y-5 justify-items-center gap-x-3 mt-10'>
            {
              ReservationProcess.map((reservation, index) => (
                <div key={index} className='w-[200px] flex flex-col gap-3'>
                  <h2 className='text-[35px] text-[#484848] font-semibold'>
                    {index + 1}
                  </h2>
                  <h4 className='text-[#484848] font-semibold text-[16px]'>{reservation.title}</h4>
                  <p className='text-[13px] text-[#484848] font-normal'>
                    {reservation.content}
                  </p>
                </div>
              ))
            }
          </div>
        </div>


      </main>
      <div className='bg-primaryColor-900 w-full flex flex-col justify-center items-center mt-16 my-5 gap-y-6'>
            <h4 className='text-[25px] text-white text-opacity-80 font-semibold mt-8'>
            Have questions or doubts?
            </h4>
            <p className='text-[15px] text-white font-normal mt-2'>
            Don’t hesitate contact us
            </p>
            <div className='flex flex-col md:flex-row max-md:gap-y-4 gap-x-3 mb-8 '>
              <Input type='text' placeholder='full name' className='bg-white placeholder:text-[#667085]'/>
              <Input type='text' placeholder='enter your question?' className='bg-white placeholder:text-[#667085]'/>
              <Button className='bg-white text-primaryColor-900  hover:bg-primaryColor-600 '>
                Send
              </Button>
            </div>
      </div>
    </div>
  )
}
