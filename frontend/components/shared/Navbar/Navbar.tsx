"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import logo from '@/assets/logo (2).png'
import { useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'
import ToggleMenu from './ToggleMenu'
import Dropdown from './DropdownMenu'
import { MainLink } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const Navbar = () => {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
    const pathname = usePathname()
    const router = useRouter()
    const [isScrolled,setIsScrolled] = useState(false)

    useEffect(()=>{
         const handleScroll = ()=>{
            setIsScrolled(window.scrollY > 10)
         }

         window.addEventListener('scroll',handleScroll)
         
         return ()=> window.removeEventListener('scroll',handleScroll)
    },[isScrolled])

    return (
        <div className={cn(`w-full shadow-md sticky top-0  z-50 bg-white/50  transition-all duration-300`,{
            'backdrop-blur-lg':isScrolled
        })}>
            <div className='w-full h-full max-w-6xl flex mx-auto justify-between items-center max-xl:px-7'>
                {/**Logo */}
                <Link href="/">
                    <Image src={logo} alt='logo' width={150} height={74} />
                </Link>
                <div className='hidden lg:block space-x-4'>
                    {
                        MainLink.map((link, index) => {
                            const isActive = pathname === link.url
                            return (
                                <Link href={link.url} key={index} className={cn('text-[#A7A7A7] text-[14px] font-semibold', {
                                    isActive: 'text-[#7C7B7B]'
                                })}>
                                    {link.name}
                                </Link>
                            )
                        })
                    }
                </div>
                <div className='flex items-center space-x-4'>
                    <Button variant="outline" className='text-primaryColor-900' onClick={()=>router.push('/Listing')}>
                        Rent a Room
                    </Button>
                    {/**Large screen */}
                    <div className=' hidden lg:block'>
                        {isAuthenticated ? (
                            <Dropdown />
                        ) : (
                            <div>
                                <Button onClick={() => router.push('/login')} className='bg-primaryColor-800 hover:bg-primaryColor-700'>
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                    {/**small screen */}
                    <div className='lg:hidden'>
                        <ToggleMenu />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar