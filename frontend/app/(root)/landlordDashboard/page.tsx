"use client"
import BookingSchedule from '@/components/shared/landlord/tabs/BookingSchedule'
import Dashboard from '@/components/shared/landlord/tabs/Dashboard'
import PropertyManagement from '@/components/shared/landlord/tabs/PropertyManagement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ProtectedRoutes from '../ProtectedRoutes'
import BookingList from '@/components/shared/landlord/tabs/BookingLIst'

const Page = () => {
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'dashboard'
    console.log(activeTab)
    return (
        <ProtectedRoutes>
            <div className='w-full max-w-6xl flex flex-col md:flex-row  max-xl:px-8 my-10 mx-auto'>
                <Tabs defaultValue={activeTab} className="w-full min-h-screen">
                    <TabsList>
                        <TabsTrigger value="dashboard" className='max-md:text-[11px]'>Dashboard</TabsTrigger>
                        <TabsTrigger value="properties" className='max-md:text-[11px]'>Properties </TabsTrigger>
                        <TabsTrigger value="booking_schedule" className='max-md:text-[11px]'>
                            <span className='truncate max-md:max-w-[70px] max-md:overflow-hidden max-md:whitespace-nowrap'>
                                Booking Schedule
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="bookings" className='max-md:text-[11px]'>Bookings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard">
                        <Dashboard />
                    </TabsContent>
                    <TabsContent value="properties">
                        <PropertyManagement />
                    </TabsContent>
                    <TabsContent value="booking_schedule">
                        <BookingSchedule />
                    </TabsContent>
                    <TabsContent value="bookings">
                        <BookingList/>
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoutes>
    )
}

export default Page