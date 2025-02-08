"use client"
import Image from 'next/image'
import React from 'react'
import LoginImage from '@/assets/loginImage.png'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLoginMutation } from '@/redux/features/userApislice'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAppDispatch } from '@/redux/store'
import { finishIntialLoad, setAuth } from '@/redux/features/userSlice'
import GoogleButton from '@/components/shared/GoogleButton'

const formSchema = z.object({
  email: z.string().email('email is invalid').min(1, 'email is required'),
  password: z.string().min(7, "Your password must be at least 7 characters"),
})


const Page = () => {
  const router = useRouter()
  const searhParams = useSearchParams()
  const redirectLink = searhParams.get('redirect') || "/"
  const dispatch = useAppDispatch()
  const [login,{isLoading}] = useLoginMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try{
        const response = await login({
          email:values.email,
          password:values.password
        }).unwrap();
        console.log(response)
        dispatch(setAuth({
          accessToken:response.access_token,
          refreshToken:response.refresh_token,
          userInfo:{
            email:response.email,
            full_name:response.full_name,
            id:response.id,
            role:response.role
          }
        }))
        form.reset()
        dispatch(finishIntialLoad());
        router.push(redirectLink)

    }catch(err:any){
      console.log(err)
      const errorMessage = err?.data?.detail || 'Something went wrong. Please try again.';
        toast.error(errorMessage)
    }
  }

  return (
      <div className='w-full h-full flex flex-col lg:flex-row justify-end'>
        <div className='w-full lg:w-1/3 hidden lg:block fixed left-0'>
        <Image src={LoginImage} className='h-screen' alt='signup' />
       </div>

        {/** login form */}
        <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10 '>
          <h4 className='font-semibold text-[30px] text-primaryColor-900 my-5 '>
            Log In
          </h4>
           <p className='text-[#484848] text-[14px] font-normal mb-7'>
            Welcome back ! Please enter your details
           </p>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[350px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email"
                      className='w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                    type='password'
                    placeholder="Enter your Password"
                      className='w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='w-full flex justify-end items-center'>
               <Link href="/forget_password" className='text-primaryColor-900 font-bold text-[12px]'>
               Forget password?
               </Link>
            </div>

            <Button type="submit" className='w-full md:w-[360px] h-[44px] bg-primaryColor-900' disabled={isLoading}>
               {
                 isLoading ? 'loading...':'Sign in'
               }
            </Button>
          </form>
        </Form>
           
        <div className='w-full flex flex-col justify-center items-center my-5 max-w-[350px]'>
              <GoogleButton title='Continue with Google'/>
               
               <div className='text-[#484848] font-normal text-[12px] mt-5 text-center mb-7'>
                <span>Don't have an account?</span>
                <Link href="/register" className='text-primaryColor-900 font-bold ml-1'>
                 Sign up
                </Link>
               </div>
           </div>

        </div>
      </div>
  )
}

export default Page