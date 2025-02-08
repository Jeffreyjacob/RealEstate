"use client"

import Image from 'next/image'
import React from 'react'
import signupImage from '@/assets/signupImage.png'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectButton from '@/components/shared/SelectButton'
import Link from 'next/link'
import { useRegisterMutation } from '@/redux/features/userApislice'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import GoogleButton from '@/components/shared/GoogleButton'

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('email is invalid').min(1, 'email is required'),
  password: z.string().min(7, "Your password must be at least 7 characters"),
  role: z.enum(['RENTER', 'LANDLORD'])
})

const Page = () => {
  const router = useRouter()
  const [register,{isLoading}] = useRegisterMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'RENTER'
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try{
     const data =  await register({
        email:values.email,
        full_name: values.fullName,
        password: values.password,
        role: values.role
      }).unwrap()
        console.log(data)
        form.reset()
         toast.success('an otp has been sent to your email')
         router.push('/verifyEmail')
    }catch(err:any){
      console.log(err)
      const errorMessage = err?.data?.message || 'Something went wrong. Please try again.';
        toast.error(errorMessage)
    }
    
  }
   

  const roleData = [
    {name:'Landlord',value:'LANDLORD'},
    {name:'Renter',value:'RENTER'}
  ]
  return (
    <div className='w-full h-full flex flex-col lg:flex-row'>
      {/** sign up form */}
      <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10'>
        <h4 className='font-semibold text-[30px] text-primaryColor-900 my-5 '>
          Sign Up
        </h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[350px]">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name"
                      className=' w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <SelectButton
                      placeholder="Enter Role"
                      className='w-full md:w-[360px] h-[44px]'
                      value={field.value}
                      onChange={field.onChange}
                      data={roleData}/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full md:w-[360px] h-[44px] bg-primaryColor-900' disabled={isLoading}>
               {
                 isLoading ? 'loading...':'Create account'
               }
            </Button>
          </form>
        </Form>

        <div className='w-full flex flex-col justify-center items-center my-5 max-w-[350px]'>
              <GoogleButton title='Continue with Google'/>
               
               <div className='text-[#484848] font-normal text-[12px] mt-5 text-center mb-7'>
                <span>You already have an account?</span>
                <Link href="/login" className='text-primaryColor-900 font-bold ml-1'>
                 Log in
                </Link>
               </div>
           </div>

      </div>
      <div className='w-full lg:w-1/3 hidden lg:block fixed right-0'>
        <Image src={signupImage} className='h-screen' alt='signup' />
      </div>
    </div>
  )
}

export default Page