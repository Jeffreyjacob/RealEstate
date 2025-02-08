import { AddressResponse } from '@/lib/types'
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'



export const addressSlice = createApi({
    reducerPath:'addressApi',
    baseQuery:fetchBaseQuery({baseUrl:'https://api.geoapify.com/v1/geocode'}),
    endpoints:(builder)=>({
        getAddressSuggestion: builder.query<AddressResponse,{text:string}>({
           query:({text})=>({
            url: '/autocomplete',
            params:{text,format:'json',apiKey:process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
           })
        })
    })
})




export const {useGetAddressSuggestionQuery} = addressSlice