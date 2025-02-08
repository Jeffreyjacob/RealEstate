import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import aboutusImage from "@/assets/aboutus.png"
import { Plus } from 'lucide-react'
import { Team } from '@/lib/types'
import TeamMember from '@/components/shared/Aboutus/TeamMember'



const Page = () => {
  return (
    <div className='w-full max-w-5xl mx-auto flex flex-col max-xl:px-8 gap-16'>
        <div className='w-full flex flex-col md:flex-row mt-14 gap-6 md:gap-8'>
            <div className='w-full md:w-[50%]'>
              <h2 className='text-[18px] text-primaryColor-900 font-normal'>About Us</h2>
              <p className='text-[20px] md:text-[30px] text-[#484848] font-semibold'>Erasmus Life Housing - your go-to hub for finding the perfect home for students, by students</p>
            </div>
            <div className='w-full md:w-[50%]'>
             <p className='text-[12px] md:text-[14px] text-[#484848] mt-8'>
             Whether you are coming to Lisbon for Erasmus, Exchange, Traineeship, Full Masters or Work we definitely have a Room, 
             Studio or Apartment that suits your needs!
             Our ultimate goal is to make Lisbon the number one destination for International Students and Young Workers, and
              we most surely don’t want that your experience finding accommodation to be a negative point of that experience!
             </p>
            </div>
        </div>
        <Card className='w-full flex flex-col md:flex-row mt-14 gap-6 p-3'>
           <Image src={aboutusImage} alt='aboutus-image' className='w-full md:w-[45%] h-[400px]' />
           <div className='w-full flex flex-col gap-y-5 justify-center items-start'>
              <h3 className='text-[16px] md:text-[18px] text-primaryColor-900 font-semibold'>Our Achievements</h3>
              <p className='text-[#484848] text-[12px] md:text-[14px] font-normal'>
              Since 2013, our team has helped tons of students discover their ideal place. We’ve got a wide selection of student-friendly rooms, all built and managed just for you. Explore different neighborhoods, compare options, and make the right choice for a safe and inspiring home. Your journey is important, and the right housing sets the stage for a fantastic experience and personal growth.
              </p>
              <div className='flex justify-between items-center mt-6 w-full max-md:mb-10 md:px-5'>
              <div className='flex flex-col'>
                <span className='text-[#344054] text-[30px] font-semibold flex gap-1 w-full relative items-center'>
                  4235
                  <Plus className='text-[#1171B9] w-5 h-5' />
                </span>
                <p className='text-[#6C6B6B] text-[14px] font-normal text-center'>
                  Reservation 
                </p>
              </div>

              <div className='flex flex-col '>
                <span className='text-[#344054] text-[30px] font-semibold flex gap-1 w-full relative items-center'>
                  535
                  <Plus className='text-[#1171B9] w-5 h-5' />
                </span>
                <p className='text-[#6C6B6B] text-[14px] font-normal text-center'>
                  Students
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
        </Card>
        <div className='w-full flex flex-col justify-center items-center gap-y-5'>
            <h3 className='text-[#484848] text-[26px] md:text-[32px] text-center'>Meet Our Team</h3>
            <p className='text-[#A1A7B0] text-[12px] md:text-[14px] font-normal w-full md:w-[500px] text-center'>
            Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do you best work.
            </p>
            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-y-6 items-center justify-center mt-7 mb-10'>
               {
                Team.map((team,index)=>(
                    <TeamMember team={team} key={index}/>
                ))
               }
            </div>
        </div>
    </div>
  )
}

export default Page