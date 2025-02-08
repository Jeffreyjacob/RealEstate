"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import resetImage from '@/assets/resetpasswordImage.png'
import { useResetPasswordMutation } from '@/redux/features/userApislice'
import { toast } from 'sonner'


const formSchema = z.object({
  password: z.string().min(7,"your password must at least be 7 characters"),
  confirm_password: z.string()
}).refine((data)=> data.password === data.confirm_password,{
    message: "both password must match",
    path: ['confirm_password']
})

const Page = () => {
  const { uidb64, token } = useParams()
  const [resetPassword,{isLoading}] = useResetPasswordMutation()
  console.log(uidb64)

  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password:'',
      confirm_password:''
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
      try{
         const response = await resetPassword({
           password:values.password,
           confirm_password:values.confirm_password,
           uidb64:uidb64,
           token:token
         }).unwrap()
         toast.success('your password has been reset')
         router.push('/login')
      }catch(err:any){
        console.log(err)
        const errorMessage = err?.data?.message || 'Something went wrong. Please try again.';
        toast.error(errorMessage)
      }
  }
  return (
    <div className='w-full h-full flex flex-col lg:flex-row'>
      <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10'>
        <h4 className='font-semibold text-[30px] text-primaryColor-900 my-5 '>
          Reset your password
        </h4>
       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[350px]">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                    type='password'
                    placeholder="Enter your password"
                      className=' w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
             
             <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                     type='password'
                    placeholder="confirm your password"
                      className=' w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full md:w-[360px] h-[44px] bg-primaryColor-900 hover:bg-primaryColor-700' disabled={isLoading}>
               {
                isLoading ? "Loading...":"Reset password"
               }
            </Button>
          </form>
        </Form>
      </div>
      <div className='w-full lg:w-1/3 hidden lg:block fixed right-0'>
        <Image src={resetImage} className='h-screen' alt='signup' />
      </div>
    </div>
  )
}

export default Page