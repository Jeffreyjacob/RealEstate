"use client"
import { useAppSelector } from '@/redux/store'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ProtectedRoutes = ({children}:{children:React.ReactNode}) => {
    const {isAuthenticated,isLoading} = useAppSelector((state)=>state.user)
    const router = useRouter()
    const pathName = usePathname()
    useEffect(()=>{
      if(!isLoading && !isAuthenticated){
        router.push(`/login?redirect=${pathName}`)
      }
    },[isAuthenticated,isLoading,router])

    if(isLoading){
        return <div className='w-full min-h-screen flex justify-center items-center'>
            <Loader2 className='w-4 h-4'/>
        </div>
    }
  return (
    <>
    {children}
    </>
  )
}

export default ProtectedRoutes