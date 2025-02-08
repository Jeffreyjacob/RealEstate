"use client"
import LocationOption from '@/components/shared/landlord/LocationOption'
import FacilityPopover from '@/components/shared/landlord/popover/FacilityPopover'
import SelectButton from '@/components/shared/SelectButton'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { categoryOptions } from '@/lib/types'
import { useEditApartmentMutation, useGetApartmentByIdQuery } from '@/redux/features/apartmentApislice'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'


import dynamic from 'next/dynamic'
const UploadImagesContainer = dynamic(() => import('@/components/shared/landlord/UploadImagesContainer'), { ssr: false })


const formSchema = z.object({
    title: z.string().min(1, { message: "Enter an apartment title" }),
    description: z.string().min(1, { message: "Enter an apartment description" }),
    bathroom: z.string().min(1, { message: 'Enter the number of bathroom' }),
    location: z.string().min(1, { message: 'Enter a location' }),
    price: z.string().min(1, { message: 'Enter price' }),
    bedroom: z.string().min(1, { message: 'Enter bedroom' }),
    guest: z.string().min(1, { message: 'Enter number of guest' }),
    category: z.string().min(1, { message: "Select a category" }),
    uploaded_images: z.array(z.any()).min(1, { message: 'Select at least one image' }),
    facilities: z.array(z.string()).min(1, { message: 'Select at least one facility' })
})

export type createApartmentTye = z.infer<typeof formSchema>

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const apartmentId = searchParams.get('id')
    const { data, isLoading: ApartmentDetailLoading } = useGetApartmentByIdQuery({
        id: apartmentId as string
    })
    const [Images, setImages] = useState<File[]>([])
    const [DefaultValues, setDefaultValues] = useState<z.infer<typeof formSchema>>({
        title: data?.title ? data.title : '',
        description: data?.description ? data.description : '',
        location: data?.location ? data.location : '',
        bedroom: data?.bedrooms ? data.bedrooms.toString() : '',
        bathroom: data?.bathroom ? data.bathroom.toString() : '',
        guest: data?.guest ? data.guest.toString() : '',
        category: data?.category ? data.category : '',
        price: data?.price ? data.price : '',
        uploaded_images: data?.images ? Images : [],
        facilities: data?.facilities ? data.facilities : []
    })
    const [EditApartment, { isLoading, isSuccess }] = useEditApartmentMutation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: DefaultValues
    })

    useEffect(() => {
        const initializeForm = async () => {
            if (data) {
                form.reset({
                    title: data.title,
                    description: data.description,
                    location: data.location,
                    category: data.category,
                    price: data.price,
                    guest: data.guest.toString(),
                    bedroom: data.bedrooms.toString(),
                    bathroom: data.bathroom.toString(),
                    facilities: data.facilities,
                });
                console.log("Form values after reset:", form.getValues()); // Debug
                console.log("Category after reset:", data.category); // Debug
            }

            if (data?.images) {
                const convertImage = async () => {
                    const newImages: File[] = [];
                    for (const image of data.images) {
                        try {
                            const response = await fetch(image)
                            const blob = await response.blob()
                            const fileName = image.split('/').pop() || 'edit-user';
                            const file = new File([blob], fileName, { type: blob.type });
                            newImages.push(file)
                        } catch (error) {
                            console.error(`Error fetching image ${image}:`, error)
                        }
                    }
                    setImages(newImages)
                    form.setValue("uploaded_images", newImages);
                }
                convertImage()
            }
        }
        initializeForm()
    }, [data, form])



    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (typeof window !== "undefined") {
            const files = values.uploaded_images;
            if (files && files.length) {
                const isValidFile = files.every(file => file instanceof File); // Make sure each item is a File
                if (!isValidFile) {
                    toast.error("Please upload valid image files.");
                    return;
                }
            }
        }
        try {
            await EditApartment({
                data: {
                    title: values.title,
                    location: values.location,
                    description: values.description,
                    bedroom: values.bedroom,
                    bathroom: values.bathroom,
                    category: values.category,
                    price: values.price,
                    uploaded_images: values.uploaded_images,
                    facilities: values.facilities,
                    guest: values.guest
                },
                id: apartmentId
            }).unwrap()
            toast.success('Apartment updated')
            router.push('/landlordDashboard?tab=properties')
        } catch (error: any) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='w-full max-w-5xl flex flex-col md:flex-row  max-xl:px-8 my-10 mx-auto'>
            {
                ApartmentDetailLoading ? (
                    <div className='w-full h-full flex justify-center items-center'>
                        <Loader2 className='w-4 h-4 text-primaryColor-800' />
                    </div>
                ) :
                    (
                        <div className='w-full h-full'>
                            <h3 className='text-[20px] font-bold text-primaryColor-900 mb-6'>Edit Apartment</h3>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <LocationOption value={field.value}
                                                            onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name="bathroom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bathroom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Amount of bathrooms" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bedroom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bedrooms</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Amount of bedrooms" {...field}
                                                            className='w-full' />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter price" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="guest"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Guests</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter guest number" {...field}
                                                            className='w-full' />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <FormControl>
                                                        <SelectButton value={form.watch("category")} onChange={field.onChange}
                                                            placeholder='Select Catgory' className='w-full'
                                                            data={categoryOptions} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="facilities"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Facilities</FormLabel>
                                                    <FormControl>
                                                        <FacilityPopover
                                                            value={field.value} onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter description..."
                                                            className='h-[150px]'
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="uploaded_images"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Images</FormLabel>
                                                    <FormControl>
                                                        <UploadImagesContainer
                                                            value={field.value}
                                                            onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        <div className="w-full flex gap-4 mt-4 h-full">
                                                            {field.value?.map((image, index) => (
                                                                <div key={index} className="relative w-[90px] h-[70px]">
                                                                    <Image
                                                                        src={URL.createObjectURL(image)}
                                                                        alt={`preview-${index}`}
                                                                        width={90}
                                                                        height={70}
                                                                        layout='responsive'
                                                                        className="object-contain rounded-md border shadow-md"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="absolute -top-3 -right-3 bg-[#EFF8FF] p-1 rounded-full"
                                                                        onClick={() => {
                                                                            const updatedImages = field.value.filter((_, i) => i !== index);
                                                                            field.onChange(updatedImages);
                                                                        }}
                                                                    >
                                                                        <X className='w-4 h-4 text-primaryColor-700' />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" className='bg-primaryColor-900 text-white hover:bg-primaryColor-700' disabled={isLoading}>
                                        {isLoading ? "Updating..." : "Update"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    )
            }
        </div>

    )
}

export default Page