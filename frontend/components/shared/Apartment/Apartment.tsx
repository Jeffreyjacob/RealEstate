"use client"
import { Card } from '@/components/ui/card'
import { ApartmentType } from '@/lib/types'
import {  useGetRelatedApartmentQuery } from '@/redux/features/apartmentApislice'
import { useAddFavoriteMutation } from '@/redux/features/userApislice'
import { useAppSelector } from '@/redux/store'
import { Heart, Loader, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface ApartmentProps {
    data: ApartmentType,
    pageTye?:string,
    id?:string|number
}

const Apartment: React.FC<ApartmentProps> = ({ data,pageTye,id}) => {
    const userinfo = useAppSelector((state) => state.user.userInfo)
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
    const {refetch:refetchRelatedApartment} = useGetRelatedApartmentQuery({
        id:id as string,
    },{skip:!id})
    const router = useRouter()
    const [addFavorite, { isLoading }] = useAddFavoriteMutation()
    const AddFavoriteHandler = async () => {
        try {
            const response = await addFavorite({
                apartmentId: data.id
            }).unwrap()
            toast.success(response.message)
            
            if(pageTye == "RelatedApartment"){
               refetchRelatedApartment()
            }
        } catch (err: any) {
            console.log(err)
            const errorMessage = err?.data?.message || 'Something went wrong. Please try again.';
        }
    }
    return (
        <Card className='w-[280px] h-[380px] rounded-xl hover:scale-105 transition-all duration-300'>
            <div className='relative w-full h-[67%]'>
                <Image
                    src={data.images[0]}
                    alt='apartment-image'
                    layout='fill'
                    objectFit='cover'
                    className='rounded-t-lg cursor-pointer'
                    onClick={()=>router.push(`/apartmentDetail/${data.id}`)}
                />
            </div>
            {/* Additional content can go here */}
            <div className='w-full px-4 flex flex-col gap-2 my-3'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-[17px] text-[#000F2D] font-semibold'>
                        {data.title}
                    </h2>
                    {
                        isAuthenticated && (
                            <div>
                                {
                                    isLoading ? (
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                    ) : <Heart
                                        className={`w-5 h-5 cursor-pointer ${data.favorited.includes(userinfo?.id || 1) ? 'text-[#344054]' : 'text-[#344054]'} `}
                                        strokeWidth={data.favorited.includes(userinfo?.id || 1) ? 4 : 1}
                                        onClick={AddFavoriteHandler}
                                    />
                                }
                            </div>
                        )
                    }
                </div>
                <span className='text-[#000F2D] font-normal text-[12px] leading-4'>
                    {data.location}
                </span>
                <div className='flex justify-between items-center'>
                    <span className='text-[14px] text-primaryColor-900 font-normal'>
                        $ {data.price} / night
                    </span>
                    <span>

                    </span>
                </div>
            </div>
        </Card >
    )
}

export default Apartment