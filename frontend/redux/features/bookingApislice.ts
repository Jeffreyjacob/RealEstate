import { BookingListType, CreateCheckoutSessionInput, LandlordStatistics } from "@/lib/types";
import { apiSlice } from "@/services/apiservice";

interface BookingResponse {
    count: number
    next: number
    previous: number
    results: BookingListType[]
}

export const BookingApislice = apiSlice.injectEndpoints({
    endpoints:builder =>({
        LandlordBooking:builder.query<BookingResponse,void>({
          query:()=>({
             url:'/booking/landlord',
             method:'GET'
          }),
          providesTags:(result: any, error: any)=>[{
            type:'landlordbooking'
          }]
        }),
        UserBooking:builder.query<BookingResponse,{title:string,page:number}>({
          query:({title,page})=>({
            url: '/booking/user',
            method:"GET",
            params:{title,page}
          }),
          providesTags: (result:any,error:any,{title,page})=>[{
             type:'userbooking',title,page
          }],
          keepUnusedDataFor:0
        }),
        ApartmentBooking:builder.query<BookingListType[],{id:string}>({
            query:({id})=>({
              url:`/booking/apartmentbooking/${id}/`,
              method:'GET'
            }),
            providesTags:(result:any,error:any,{id})=>[{
              type:'apartmentBookings',id
            }]
         }),
        CreateCheckoutSession:builder.mutation<{url:string},CreateCheckoutSessionInput>({
           query:({nights,guest,start_date,end_date,apartment})=>({
              url:'/booking/checkout-session/',
              method: 'POST',
              body:{nights,guest,start_date,end_date,apartment}
           }),
           onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
                try{
                  await queryFulfilled
                  dispatch(
                     BookingApislice.util.invalidateTags([
                       {type:'userbooking'},
                       {type:'apartmentBookings',id:args.apartment}
                     ])
                  )
                }catch(error){
                    console.error('Error during createApartment mutation', error);
                }
           }
        }),
        ChangeBookingStatus:builder.mutation<void,{booking_status:string,id:string}>({
            query:({booking_status,id})=>({
               url:`booking/update_booking_status/${id}/`,
               method:"PUT",
               body:{booking_status}
            })
        }),
        GetBookingDetails:builder.query<BookingListType,{id:string}>({
           query:({id})=>({
             url:`/booking/${id}`,
             method:"GET"
           })
        }),
        LandLordStatistics:builder.query<LandlordStatistics,void>({
            query:()=>({
                url:"/booking/landlordStatistics/",
                method:"GET"
            })
        })
    })
})


export const {
    useCreateCheckoutSessionMutation,
    useLandlordBookingQuery,
    useUserBookingQuery,
    useChangeBookingStatusMutation,
    useGetBookingDetailsQuery,
    useApartmentBookingQuery,
    useLandLordStatisticsQuery,
} = BookingApislice