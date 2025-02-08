import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { UserChatType } from '@/lib/types'
import { useMarkAsReadMutation } from '@/redux/features/messageApi'
import { useAppSelector } from '@/redux/store'
import { format } from 'date-fns'
import { CheckCheck, Dot } from 'lucide-react'
import Link from 'next/link'
import { userInfo } from 'node:os'
import React from 'react'

interface ChatcontainerProps {
    chats: UserChatType
}

const Chatcontainer: React.FC<ChatcontainerProps> = ({
    chats
}) => {
    const {userInfo} = useAppSelector((state)=>state.user)
    const [markAsRead] =  useMarkAsReadMutation()
    const MarkAsReadhandler = async ()=>{
       try{
        await markAsRead({id:chats.booking_id})
       }catch(error){
         console.log(error)
       }
    }
    return (
        <div className='w-full h-full flex flex-col gap-2 '>
            <Link className='w-full h-[65px] flex  hover:bg-primary/5 hover:rounded-md justify-start items-center gap-6 p-3 relative' 
            href={`/messages/${chats.booking_id}?recipient=${chats.recipient_id}`}
            onClick={MarkAsReadhandler}>
                <Avatar className='w-[50px] h-[50px]'>
                     <AvatarImage src={chats.profileImage} alt="@shadcn" />
                    <AvatarFallback className=' capitalize text-primaryColor-700'>
                        {chats.full_name[0]} 
                    </AvatarFallback>
                </Avatar>
                <div className='w-full h-full flex flex-col'>
                   <h3 className={` ${chats.is_read ? "text-[#52525B]":"text-[#22172A]"} capitalize text-[14px] lg:text-[16px] font-semibold`}>{chats.full_name}</h3>
                   <div className='w-full h-full flex justify-between items-center '>
                     <div className={`${chats.is_read ? "text-[#52525B]":"text-[#22172A]"} capitalize text-[12px]  h-full lg:text-[13px] font-normal flex gap-1 items-center `}>
                         {chats.sender == userInfo?.id && <CheckCheck className='w-4 h-4 text-[#9EA3AE]' /> }
                         <span className=' line-clamp-1'>
                         {chats.last_message}
                         </span>
                     </div>
                     <span className='text-[#9EA3AE] text-[11px] lg:text-[12px] font-normal '>
                        {format(new Date(chats.timestamp),'h:mm a')}
                     </span>
                   </div>
                </div>
                 {
                    chats.is_read == false && <Dot className='w-12 h-12 text-primaryColor-900 absolute top-[-4px] right-0'/>
                 } 
            </Link>
            <Separator />
        </div>
    )
}

export default Chatcontainer