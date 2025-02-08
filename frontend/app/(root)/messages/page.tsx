"use client"
import React, { useEffect, useState } from 'react'
import ProtectedRoutes from '../ProtectedRoutes'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUserChatQuery } from '@/redux/features/messageApi'
import { UserChatType } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import Chatcontainer from '@/components/shared/Messages/Chatcontainer'

const Page = () => {
  const { data, isLoading } = useUserChatQuery()
  const [Chats, setChats] = useState<UserChatType[]>([])
  useEffect(() => {
    if (data) {
      setChats(data)
    }
  }, [data])
  console.log(data)
  return (
    <ProtectedRoutes>
      <div className='w-full h-full flex justify-center items-center max-lg:px-4'>
        <Card className='w-full sm:max-w-4xl min-h-[90vh] mt-6 shadow-lg p-5'>
          <div className='w-full p-4'>
            <h3 className='text-[17px] font-semibold text-[##484848]'>Messages</h3>
          </div>
          <ScrollArea className='w-full space-y-4 h-[70vh] p-4'>

            {
              isLoading ? (
                <div className='w-full flex flex-col space-y-3 '>
                  {
                    [1, 2, 3, 4, 5, 6].map((skeleton, index) => (
                      <div className='w-full h-full flex flex-col gap-2' key={index}>
                        <Skeleton className='w-full h-[60px]  rounded-lg' />
                        <Separator />
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className='w-full h-full flex flex-col space-y-2'>
                  {
                    Chats.length == 0 ? <div className='w-full h-full flex justify-center items-center text-center'>
                      <p className='text-[14px] text-center'>No Chat</p>
                    </div> : (
                      Chats.map((chats, index) => (
                        <Chatcontainer key={index} chats={chats} />
                      ))
                    )
                  }
                </div>
              )
            }
          </ScrollArea>
        </Card>
      </div>
    </ProtectedRoutes>
  )
}

export default Page