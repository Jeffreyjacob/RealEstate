"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MainLink } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useLogoutMutation } from '@/redux/features/userApislice'
import { logout } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { CircleUser, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import logo from '@/assets/logo (2).png'
import { apiSlice } from '@/services/apiservice'


const ToggleMenu = () => {
    const userInfo = useAppSelector((state) => state.user.userInfo)
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
    const refresh_token = useAppSelector((state) => state.user.refreshToken)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [LogOut, { isLoading }] = useLogoutMutation()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const logoutHandler = async () => {
        try {
            await LogOut({
                refresh: refresh_token
            }).unwrap()
            dispatch(logout())
            dispatch(apiSlice.util.resetApiState())
            setOpen(false)
            router.push('/')
        } catch (err: any) {
            console.log(err)
            const errorMessage = err?.data?.message || 'Something went wrong. Please try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                <Menu className='text-neutral-500 w-6 h-6 md:w-8 md:h-8' />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='flex gap-2 items-center'>
                        {isAuthenticated ? (
                            <>
                                <CircleUser className='w-6 h-6 text-neutral-500' />
                                <p className='text-[19px] font-bold capitalize'>{userInfo?.full_name}</p>
                            </>
                        ) : (
                            <Image src={logo} alt='logo' width={130} height={65} />
                        )}
                    </SheetTitle>
                </SheetHeader>
                <Separator className='mt-4 mb-2' />
                <div className='flex flex-col gap-3 mx-8'>
                    {isAuthenticated && (
                        <>
                            <Link href="/account" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                                Account
                            </Link>
                            {userInfo?.role === "LANDLORD" && (
                                <Link href="/landlordDashboard" onClick={handleClose} className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-600 capitalize'>
                                    Landlord
                                </Link>
                            )}
                            <Link href="/reservations" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-600 capitalize' onClick={handleClose}>
                                Reservations
                            </Link>
                            <Link href="/favorite" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-600 capitalize' onClick={handleClose}>
                                Favorite
                            </Link>
                            <Link href="/messages" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-600 capitalize' onClick={handleClose}>
                                Messages
                            </Link>
                        </>
                    )}
                    {MainLink.map((link, index) => {
                        const isActive = pathname === link.url
                        return (
                            <Link href={link.url} key={index} onClick={handleClose} className={cn('text-[#7C7B7B] text-[14px] hover:text-primaryColor-600', {
                                isActive: 'text-[#7C7B7B]'
                            })}>
                                {link.name}
                            </Link>
                        )
                    })}
                    {isAuthenticated ? (
                        <Button className='bg-primaryColor-800 hover:bg-primaryColor-700' onClick={logoutHandler} disabled={isLoading}>
                            {isLoading ? "Logging out" : "Logout"}
                        </Button>
                    ) : (
                        <Button className='bg-primaryColor-800 hover:bg-primaryColor-700' onClick={() => router.push('/login')}>
                            Log in
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ToggleMenu
