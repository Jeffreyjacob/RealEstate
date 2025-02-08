import { ScrollArea } from '@/components/ui/scroll-area'
import { useStateContext } from '@/context/stateContext'
import { MessageType } from '@/lib/types'
import { useGetAllMessageQuery, useMarkAsReadMutation } from '@/redux/features/messageApi'
import { useAppSelector } from '@/redux/store'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type MessageContainerProps = {
    booking_id: string
    recipient: string
}

const MessageContainer: React.FC<MessageContainerProps> = ({
    booking_id,
    recipient
}) => {
    const [MessageText, SetMessageText] = useState("")
    const { userInfo } = useAppSelector((state) => state.user)
    const { ChatSocketRef, AddMessage, setAddMessage } = useStateContext()
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [markAsRead] = useMarkAsReadMutation()
    const { data, isLoading } = useGetAllMessageQuery({
        id: booking_id
    })
    
    const scrollToBottom = ()=>{
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0,scrollRef.current.scrollHeight);
        }
    }
    useEffect(() => {
        if (data) {
            setAddMessage([...data])
            markAsRead({id:booking_id})
        }
    }, [data])

    useEffect(() => {
        if (!isLoading && AddMessage?.length > 0) {
            scrollToBottom()
        }
    }, [isLoading,AddMessage])

    useEffect(()=>{
        const markasRead = async ()=>{
            await markAsRead({id:booking_id})
        }
        markasRead()
    },[AddMessage])
    const SendMessage = () => {
        if (ChatSocketRef && ChatSocketRef.readyState === WebSocket.OPEN && MessageText.trim() !== "") {
            const MessageData: MessageType = {
                message: MessageText,
                booking_id: booking_id,
                recipient: parseInt(recipient),
                sender: userInfo?.id || 0,
                timestamp: new Date().toISOString(),
            };
           const response = ChatSocketRef.send(
                JSON.stringify(MessageData)
            );
            SetMessageText('');
            scrollToBottom()
        } else {
            console.error('Socket is not connected or MessageText is empty');
        }
    }
    return (
        <div className='h-[80vh] md:h-[70vh] mt-10'>
            <div className='max-h-[80h] flex flex-col justify-center items-center'>
                <div className='bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 w-[80vw] border flex flex-col'>
                    <div className='mt-4'>

                        <div className='mt-2'>
                            {
                                isLoading ? <div className='space-y-4 h-[50vh] overflow-y-auto pr-4'>
                                    loading...
                                </div> : <div className='w-full h-[50vh] overflow-y-scroll pr-4 ' ref={scrollRef}>
                                    {
                                        AddMessage?.map((message, index) => (
                                            <div key={index} className={`flex my-2 ${message.sender === userInfo?.id ? "justify-end" : "justify-start"}`}>
                                                <div className={`inline-block rounded-lg ${message.sender === userInfo?.id ? "bg-primaryColor-700 text-white" : " bg-gray-100 text-gray-800"} px-3 py-2 max-w-xs break-all`}>
                                                    <p className='text-[13px]'>{message.message}</p>
                                                    <span className={`text-sm text-[10px] flex ${message.sender == userInfo?.id ? "text-white justify-end":"text-primaryColor-900 justify-start"}`}>
                                                      {format(new Date(message.timestamp), 'eeee, h:mm a')}
                                                    </span>
                                                    {/* <span>
                                                        {message.senderId === userInfo?.id && message.isRead && (
                                                            <BsCheck2All />
                                                        )}
                                                    </span> */}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                        </div>

                        <div className='mt-8 flex'>
                            <input
                                type='text'
                                className='rounded-full py-2 px-4 mr-2 w-full'
                                placeholder='Type a message'
                                name='message'
                                onChange={(e) => SetMessageText(e.target.value)}
                                value={MessageText}
                            />
                            <button type='submit'
                                className='bg-primaryColor-500 text-white rounded-full px-4 py-2'
                                onClick={SendMessage}>
                                <Send className='' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageContainer