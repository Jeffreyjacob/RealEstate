"use client"
import { useGoogleMutation } from '@/redux/features/userApislice'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { useAppDispatch } from '@/redux/store'
import { finishIntialLoad, setAuth } from '@/redux/features/userSlice'
import { Loader2 } from 'lucide-react'


const GoogleButton = ({ title }: { title: string }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [google, { isLoading,isSuccess}] = useGoogleMutation()
  // Handle Google Login success

  const handleSignInWithGoogle = async (response:any) => {
      console.log(response)
      const payload = response.credential
      try{
        const server_res = await google({
            access_token: payload
        }).unwrap()
        dispatch(setAuth({
          accessToken:server_res.access_token,
          refreshToken:server_res.refresh_token,
          userInfo:{
            email:server_res.email,
            full_name:server_res.full_name,
            id:server_res.id,
            role:server_res.role
          }
        }))
        dispatch(finishIntialLoad());
        router.push('/')
      }catch(err:any){
        console.log(err.data.detail)
        const errorMessage = err?.data?.detail || 'Something went wrong. Please try again.';
        toast.error(errorMessage)
      }
  }

  // Handle Google Login failure
  const handleLoginFailure = (error: any) => {
    toast.error('Google login failed. Please try again.')
  }



  useEffect(() => {
     window.google.accounts.id.initialize({
         client_id:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
         callback:handleSignInWithGoogle
     })

     window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {theme:'outline',size:'large',text:'continue_with',shape:'circle',width:'360'}
     )
  },[])

  return (
    <>
      <button
        id="google-signin-btn"
        disabled={isLoading} 
        className='w-full flex justify-center items-center'
        // Disable until the script is loaded
      >
        {(isLoading && isSuccess) && (
                <>
                Signing
                <Loader2 className=' animate-spin mr-2'/>
                </>
        )}
      </button>
    </>
  )
}

export default GoogleButton
