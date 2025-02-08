import { Navigation, Resouce, Tenants } from '@/lib/types'
import Image from 'next/image'
import React from 'react'
import logo from '@/assets/logo (2).png'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <div className='w-full h-full border-t-[1px] shadow-md'>
            <div className='w-full max-w-5xl mx-auto flex flex-col max-xl:px-8 gap-16 py-8 mb-10'>
                <div className='grid grid-cols-2 lg:grid-cols-4 max-lg:gap-y-9'>
                    <div className='flex flex-col gap-y-3'>
                        <Image src={logo}
                            alt='logo'
                            width={120}
                            height={44}
                        />
                        <h4 className=' uppercase text-[13px] text-[#52525B] font-normal w-[150px]'>
                            Find your Dream Accommodation
                        </h4>
                        <div className='flex gap-x-3'>
                            <Instagram className='w-4 h-4 text-[#344054]' />
                            <Facebook className='w-4 h-4 text-[#344054]' />
                            <Linkedin className='w-4 h-4 text-[#344054]' />
                        </div>
                    </div>
                    <div className=' flex flex-col gap-y-3 text-[13px] text-[#1D2939] max-w-[200px]'>
                        <h4 className='text-primaryColor-900 font-semibold'>Navigation</h4>
                        {
                            Navigation.map((link, index) => (
                                <p key={index}>
                                    {link.link}
                                </p>
                            ))
                        }
                    </div>
                    <div className=' flex flex-col gap-y-3 text-[13px] text-[#1D2939] max-w-[200px]'>
                        <h4 className='text-primaryColor-900 font-semibold'>Tenants</h4>
                        {
                            Tenants.map((link, index) => (
                                <p key={index}>
                                    {link.link}
                                </p>
                            ))
                        }
                    </div>
                    <div className=' flex flex-col gap-y-3 text-[13px] text-[#1D2939] max-w-[200px]'>
                        <h4 className='text-primaryColor-900 font-semibold'>Resource</h4>
                        {
                            Resouce.map((link, index) => (
                                <p key={index}>
                                    {link.link}
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer