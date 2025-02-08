import { Button } from '@/components/ui/button'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'
import { useApartmentBookingQuery, useCreateCheckoutSessionMutation } from '@/redux/features/bookingApislice'
import { useAppSelector } from '@/redux/store'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

interface CheckOutButtonProps {
    apartment_id: string,
    start_date: Date | undefined,
    end_date: Date | undefined,
    nights: number,
    guest: string,
    apartmentLandlordId:number
}
const CheckOutButton: React.FC<CheckOutButtonProps> = ({
    apartment_id, start_date, end_date, nights, guest,apartmentLandlordId
}) => {
    const [checkout,{isLoading}] = useCreateCheckoutSessionMutation()
    const {userInfo} = useAppSelector((state)=>state.user)
    const {refetch} = useApartmentBookingQuery({id:apartment_id})
    const handleCheckout = async () => {
        if (!apartment_id || !start_date || !end_date || !nights || !guest) {
            toast.error('Please fill in all the fields before proceeding.');
            return;
          }
        try{
            const response = await checkout({
               apartment:apartment_id,
               nights:nights,
               start_date:start_date,
               end_date:end_date,
               guest:parseInt(guest)
            }).unwrap()
            refetch()
            if (response.url) {
                window.location.href = response.url; // Redirect to Stripe Checkout
            }
        }catch(error){
            console.log(error)
            toast.error("something went wrong")
        }
    }
    return (
        <Button className='bg-primaryColor-900 hover:bg-primaryColor-700 w-full mt-5' onClick={handleCheckout} 
        disabled={isLoading || (userInfo?.id === apartmentLandlordId) }>
            {
                isLoading ? "loading...":"Book"
            }
        </Button>
    )
}

export default CheckOutButton