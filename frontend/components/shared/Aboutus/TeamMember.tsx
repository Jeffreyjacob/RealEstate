import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import React from 'react'

interface TeamMemberProps {
    team:any
}

const TeamMember:React.FC<TeamMemberProps> = ({
    team
}) => {
  return (
    <div className='w-[200px] flex flex-col gap-y-2 justify-center items-center'>
      <Image src={team.image} alt='avatar' className='w-[70px] h-[70px] object-contain'/>
      <span className='text-[#484848] text-[14px] md:text-[16px]'>{team.name}</span>
      <span className='text-[13px] md:text-[15px] text-primaryColor-900'>{team.role}</span>
    </div>
  )
}

export default TeamMember