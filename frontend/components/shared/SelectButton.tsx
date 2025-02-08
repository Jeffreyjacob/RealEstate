import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface SelectButtonProps {
    className:string;
    placeholder:string;
    value:string | undefined;
    onChange:(value:string)=>void;
    data:{
        name:string;
        value:string;
    }[];
}


const SelectButton:React.FC<SelectButtonProps> = ({
    className,
    placeholder,
    value,
    onChange,
    data
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {
          data.map((value, index) => (
            <SelectItem key={index} value={value.value}>
              {value.name}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}

export default SelectButton