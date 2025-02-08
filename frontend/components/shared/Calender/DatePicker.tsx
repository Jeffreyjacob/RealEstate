"use client"
import React from 'react'
import {DateRange,Range,RangeKeyDict} from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps{
    value:Range;
    onChange:(value:RangeKeyDict)=>void;
    bookedDate?:Date[]
}

const DatePicker:React.FC<DatePickerProps> = ({value,onChange,bookedDate}) => {
  return (
    <div>
        <DateRange
          className='border border-gray-400 rounded-xl mb-4'
          rangeColors={['#9BA7D2']}
          ranges={[value]}
          date={new Date()}
          onChange={onChange}
          direction="vertical"
          showDateDisplay={false}
          minDate={new Date()}
          disabledDates={bookedDate}
        />
    </div>
  )
}

export default DatePicker