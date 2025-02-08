import { Box, Slider } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface PriceSliderProps {
    min: number,
    max: number,
    onChange: (event: Event, value: number | number[]) => void
}

function valuetext(value: number) {
    return `${value} $`;
  }

const PriceSlider: React.FC<PriceSliderProps> = ({
    min,
    max,
    onChange
}) => {
    const [value,setValue] = useState<number[]>([min,max])

    useEffect(() => {
        setValue([min, max]);
      }, [min, max]);
    return (
        <Box width="100%">
            <Slider
                getAriaLabel={() => 'price range'}
                value={value}
                min={0}
                max={10000}            
                onChange={onChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                sx={{
                    color: '#25409C',
                    height: 8,
                    '& .MuiSlider-thumb': {
                      height: 24,
                      width: 24,
                      backgroundColor: '#fff',
                      border: '2px solid #344054',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                      backgroundColor: '#bfbfbf',
                    },
                  }}
            />

        </Box>
    )
}

export default PriceSlider