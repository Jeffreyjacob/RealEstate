import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/redux/features/userApislice'
import { logout } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { apiSlice } from '@/services/apiservice'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'


const Dropdown = () => {
    const [open, setOpen] = useState(false)
    const userInfo = useAppSelector((state) => state.user.userInfo)
    const refresh_token = useAppSelector((state) => state.user.refreshToken)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [LogOut, { isLoading }] = useLogoutMutation()
    const pathname = usePathname()

    const handleClose = ()=>{
        setOpen(false)
    }
    const logoutHandler = async () => {
        try {
            await LogOut({
                refresh: refresh_token
            }).unwrap();
            dispatch(logout())
            dispatch(apiSlice.util.resetApiState())
            setOpen(false)
            router.push('/')
        } catch (err: any) {
            console.log(err)
            const errorMessage = err?.data?.message || 'Something went wrong. Please try again.';
            toast.error(errorMessage)
        }
    }
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
                <CircleUser className='text-neutral-500 w-6 h-6 md:w-8 md:h-8' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel asChild>
                    <Link href="/account" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                        Account
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    userInfo?.role == "LANDLORD" && <DropdownMenuItem asChild>
                        <Link href="/landlordDashboard" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                            Landlord
                        </Link>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem asChild>
                    <Link href="/reservations" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                        Reservations
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/favorite" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                        Favorite
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/messages" className='text-[#7C7B7B] text-[14px] hover:text-primaryColor-300 capitalize' onClick={handleClose}>
                        Messages
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='focus:text-white focus:bg-primaryColor-700'>
                    <Button className='bg-primaryColor-800 hover:bg-primaryColor-700 w-full mt-3' onClick={logoutHandler} disabled={isLoading}>
                        {
                            isLoading ? "Logging out" : "Logout"
                        }
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default Dropdown