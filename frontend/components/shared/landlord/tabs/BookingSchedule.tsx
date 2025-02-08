"use client"
import { useLandlordBookingQuery } from '@/redux/features/bookingApislice'
import React, { useMemo, useState } from 'react'
import { DisplayOption, Gantt, ViewMode } from 'gantt-task-react'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import "gantt-task-react/dist/index.css";

type TaskTypeItems = "task" | "milestone" | "project";

const BookingSchedule = () => {
  const { data, isLoading } = useLandlordBookingQuery()
  const [displayOption, setDisplayOption] = useState<DisplayOption>({
    viewMode: ViewMode.Week,
    locale: 'en-US'
  })

  // Make sure data and data.results exist before using them
  const ganttTasks = useMemo(() => {
    if (!data || !data.results || data.results.length === 0) {
      return [];  
    }

    return data.results.map((booking) => ({
      start: new Date(booking.start_date),
      end: new Date(booking.end_date),
      name: booking.apartment.title,
      id: booking.id,
      type: "booking" as TaskTypeItems,
      progress: 0,
      isDisabled: false,
    }));
  }, [data?.results]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOption((prevState) => ({
      ...prevState,
      viewMode: event.target.value as ViewMode
    }))
  }

  // If the data is loading, display a loading message
  if (isLoading) return <div>Loading...</div>;

  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className='w-full h-full flex flex-col gap-5 mx-1'>
        <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
          <h3 className='text-[14px] font-semibold text-[##484848]'>Booking Schedule</h3>
          <div className='my-4 text-center w-full h-full flex justify-center items-center'>
            <p className='text-[14px]'>No bookings available.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-5 mx-1'>
      <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
        <div className='w-full flex justify-between items-center my-4'>
          <h3 className='text-[14px] font-semibold text-[##484848]'>Booking Schedule</h3>
          <div className='flex flex-col md:flex-row gap-3'>
            <select value={displayOption.viewMode}
              onChange={handleViewModeChange}
              className='focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none text-[12px]'>
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
            </select>
          </div>
        </div>

        <div className='overflow-x-auto overflow-hidden rounded-md bg-white my-5'>
          <Gantt 
            tasks={ganttTasks}
            {...displayOption}
            columnWidth={displayOption.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            projectBackgroundColor={"#1f2937"}
            projectProgressColor={"#aeb8c2"}
            projectProgressSelectedColor={"#9ba1a6"}
          />
        </div>
      </Card>
    </div>
  )
}

export default BookingSchedule