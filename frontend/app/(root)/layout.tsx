"use client"
import Footer from '@/components/shared/Footer/Footer'
import Navbar from '@/components/shared/Navbar/Navbar'
import { ContextProvider } from '@/context/stateContext'
import { useGetUserQuery } from '@/redux/features/userApislice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.user.accessToken)
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetUserQuery(undefined, {
    skip: !token
  })
  if (isLoading) {
    return <div className='w-full h-screen flex justify-center items-center'>
      <Loader2 className='w-4 h-4 animate-spin' />
    </div>
  }
  return (
    <ContextProvider>
      <div className="w-full h-full flex flex-col relative">
        <Navbar />
        <div className="w-full min-h-[100vh]">
          {children}
        </div>
        <Footer />
      </div>
    </ContextProvider>
  )
}

export default Layout