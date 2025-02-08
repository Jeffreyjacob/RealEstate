'use client'
import AvatarContainer from '@/components/shared/AvatarImage/AvatarContainer'
import SelectCountry from '@/components/shared/Country/SelectCountry'
import SelectButton from '@/components/shared/SelectButton'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetUserQuery, useUpdateUserMutation } from '@/redux/features/userApislice'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import ProtectedRoutes from '../ProtectedRoutes'

const formSchema = z.object({
  fullName: z.string().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  currentAddress: z.string().optional(),
})


const Page = () => {
  const { data, isLoading, refetch } = useGetUserQuery()
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation()
  const [DefaultValues, setDefaultValues] = useState<z.infer<typeof formSchema>>({
    fullName: data?.user.full_name ? data.user.full_name : '',
    gender: data?.gender ? data.gender.toUpperCase() : '',
    nationality: data?.nationality ? data?.nationality[0].toUpperCase() + data.nationality.slice(1) : '',
    phoneNumber: data?.phone_number ? data?.phone_number : '',
    currentAddress: data?.current_address ? data.current_address : ''
  })
  const imageRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)


  useEffect(() => {
    if (data?.image) {
      const convertImage = async () => {
        await fetch(data.image || '').then(
          async (response) => {
            const blob = await response.blob()
            const fileName = data.image.split('/').pop() || 'edit-user';
            const file = new File([blob], fileName, { type: blob.type });
            setImageFile(file)
          }
        )
      }
      convertImage()
    }
  }, [data?.image])
  const HandleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      toast.error("No file selected");
      return;
    }
    const file = files[0]
    const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
    if (validImageTypes.includes(file.type)) {
      setImageFile(file)
    } else {
      toast.error("You can only upload an image")
    }
  }

  const triggerFileInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DefaultValues
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    console.log(imageFile)
    try {
      const response = await updateUser({
        gender: values.gender,
        phone_number: values.phoneNumber,
        nationality: values.nationality,
        current_address: values.currentAddress,
        uploadedImage: imageFile
      })
      console.log(response)
      toast.success('Profile updated')
      refetch()
    } catch (err: any) {
      console.log(err)
      const errorMessage = err?.data?.detail || 'Something went wrong. Please try again.';
      toast.error(errorMessage)
    }
  }

  const GenderData = [
    { name: "Male", value: "MALE" },
    { name: "Female", value: "FEMALE" },
  ]
  return (
    <ProtectedRoutes>
      <div className='w-full max-w-5xl mx-auto flex flex-col max-xl:px-8 mt-10 justify-center items-center mb-10'>
        <div className='w-full flex flex-col md:flex-row'>
          {/**basic info */}
          <div className='flex flex-row justify-center items-center gap-y-3 md:flex-col w-full md:w-1/3 max-md:gap-x-5'>
            <AvatarContainer user={data} imageFile={imageFile} />
            <div className='w-full flex flex-col gap-y-4 text-start md:text-center justify-start items-start md:justify-center md:items-center'>
              <span className='text-[16px] md:text-[18px] text-[#484848] font-semibold capitalize'>
                {data?.user.full_name}
              </span>
              <span className='text-[#6C6C6C] text-[14px] md:text-[16px] font-light'>
                {data?.user.email}
              </span>
              <input hidden type='file' onChange={HandleChangeImage}
                ref={imageRef}
              />
              <Button className='w-fit p-3 bg-primaryColor-900 hover:bg-primaryColor-700' onClick={triggerFileInput}>
                Update picture
              </Button>
            </div>
          </div>
          {/**other information */}
          <div className='flex flex-col  w-4/6'>
            <h2 className='text-[#484848] text-[18px] font-semibold my-4'>Basic Info</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your fullName"
                          disabled={true}
                          {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <SelectButton value={field.value} onChange={field.onChange}
                          data={GenderData} placeholder='Select gender' className='w-full' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phonenumber " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <SelectCountry value={field.value}
                          onChange={field.onChange}
                          className='w-full flex justify-between' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter  your  address " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className='bg-primaryColor-900 hover:bg-primaryColor-700' disabled={updating}>
                  {updating ? "Updating..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  )
}

export default Page