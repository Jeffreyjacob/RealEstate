"use client"
import React from 'react'
import ProtectedRoutes from '../../ProtectedRoutes'
import MessageContainer from '@/components/shared/Messages/MessageContainer'
import { useParams, useSearchParams } from 'next/navigation'

const Page = () => {
    const { id } = useParams()
    const booking_id = id as string
    const searchParams = useSearchParams()
    const recipient_id = searchParams.get('recipient') as string
  return (
    <ProtectedRoutes>
         <MessageContainer booking_id={booking_id} recipient={recipient_id}/>
    </ProtectedRoutes>
  )
}

export default Page