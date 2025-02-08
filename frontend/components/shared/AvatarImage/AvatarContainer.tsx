import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserType } from '@/lib/types'
import React from 'react'

interface AvatarContainerProps {
    user:UserType | undefined
    imageFile:File | null
}

const AvatarContainer:React.FC<AvatarContainerProps> = ({user,imageFile}) => {
    return (
        <Avatar className='w-[150px] h-[150px]'>
            {
                imageFile && <AvatarImage src={URL.createObjectURL(imageFile)} />
            }
            <AvatarFallback className='text-[24px] text-primaryColor-700 font-semibold uppercase'>
                {user?.user.full_name[0]} 
            </AvatarFallback>
        </Avatar>

    )
}

export default AvatarContainer