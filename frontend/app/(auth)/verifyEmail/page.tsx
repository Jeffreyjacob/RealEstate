"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import veryifyImage from '@/assets/verifyemailImage (1).png'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useVerifyEmailMutation } from '@/redux/features/userApislice'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})


const Page = () => {
  const [isResetCode, setIsResetCode] = useState(false)
  const [seconds, setSeconds] = useState(60);
  const [verifyEmail,{isLoading}] = useVerifyEmailMutation()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
     try{
         const response = await verifyEmail({
           code:data.code
         }).unwrap();
         form.reset()
         toast.success('your email has been verified')
         router.push('/login')

     }catch(err:any){
         console.log(err)
         const errorMessage = err?.data?.message || 'Something went wrong. Please try again.';
         toast.error(errorMessage)
     }
  }


  useEffect(() => {
    if (seconds === 0) {
      setIsResetCode(true)
    }; // Stop when countdown reaches 0

    // Set up an interval to decrease seconds
    const intervalId = setInterval(() => {
      setSeconds(prevState => prevState - 1);
    }, 1000);

    // Cleanup the interval when the component unmounts or seconds reaches 0
    return () => clearInterval(intervalId);
  }, [seconds, isResetCode]);

  const onChangeResendCode = () => {
    setIsResetCode(false)
    setSeconds(60)
  }

  const onVerifyEmail = async () => {

  }
  return (
    <div className='w-full h-full flex flex-col lg:flex-row'>
      <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10 space-y-5'>
        <h4 className='font-semibold text-[30px] text-[#101828] my-5'>
          Verify your Email
        </h4>
        <p className='w-[360px] text-[12px]'>
          A One Time Passcode has been sent to your email, Please provide the code to verify your email account.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" min-w-[350px] space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} className='w-full lg:w-[360px]' {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className='h-[44px] w-[44px]' />
                        <InputOTPSlot index={1} className='h-[44px] w-[44px]' />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} className='h-[44px] w-[44px]' />
                        <InputOTPSlot index={3} className='h-[44px] w-[44px]' />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} className='h-[44px] w-[44px]' />
                        <InputOTPSlot index={5} className='h-[44px] w-[44px]' />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className='flex text-[14px] w-[360px] justify-center items-center space-x-2'>
              <span>You can resend a code in: </span>
              {
                isResetCode ? (
                  <span className='text-primaryColor-900 font-bold underline cursor-pointer' onClick={onChangeResendCode}>
                    Resend Code
                  </span>
                ) : (
                  <span className='text-primaryColor-900 font-bold text-[14px]'>
                    {seconds}
                  </span>
                )
              }
            </div>

            <Button type="submit" className='w-full lg:w-[360px] h-[44px] bg-primaryColor-900 hover:bg-primaryColor-700' disabled={isLoading}>
               {
                isLoading ? "loading...":"Confirm"
               }
            </Button>
          </form>
        </Form>

      </div>
      <div className='w-full lg:w-1/3 hidden lg:block fixed right-0'>
        <Image src={veryifyImage} className='h-screen' alt='signup' />
      </div>
    </div>
  )
}

export default Page