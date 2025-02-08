import { createApartmentTye } from "@/app/(root)/landlordDashboard/createApartment/page";
import { ApartmentType } from "@/lib/types";
import { apiSlice } from "@/services/apiservice";

interface ApartmentResponse {
    count: number
    next: number
    previous: number
    results: ApartmentType[]
}

interface ApartmentSearchParams {
    location: string,
    category: string,
    price_min: number,
    price_max: number,
    page: number
}

interface userApartmentSearchParams {
    title: string
    page: number
    size: number
}



export const ApartmentSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllApartments: builder.query<ApartmentResponse, void>({
            query: () => ({
                url: '/apartment',
                method: 'GET',
            }),
            providesTags: (result: any, error: any) => [
                { type: 'Apartment' }
            ],
            keepUnusedDataFor: 0
        }),
        getApartmentById: builder.query<ApartmentType, { id: string | number }>({
            query: ({ id }) => ({
                url: `/apartment/${id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0
        }),
        getRelatedApartment: builder.query<ApartmentType[], { id: string | number }>({
            query: ({ id }) => ({
                url: `/apartment/relatedApartment/${id}`,
                method: 'GET',
            }),
            //    providesTags: (result:any, error:any, id:any) => [{ type: 'RelatedApartment', id }],
        }),
        searchApartment: builder.query<ApartmentResponse, ApartmentSearchParams>({
            query: ({ location, category, price_min, price_max, page }) => ({
                url: `/apartment/searhApartment/`,
                method: 'GET',
                params: { location, category, price_min, price_max, page }
            }),
            providesTags: (result, error, { location, category, price_min, price_max, page }) => [
                {
                    type: 'ApartmentSearch', location, category, price_min, price_max, page
                }
            ],
            keepUnusedDataFor: 0,
        }),
        LandloardApartments: builder.query<ApartmentResponse, userApartmentSearchParams>({
            query: ({ title, page, size }) => ({
                url: '/apartment/userApartment/',
                method: 'GET',
                params: { title, page, size }
            }),
            providesTags: (result: any, error: any) => [
                { type: 'landlordApartment' }
            ]
        }),
        createApartment: builder.mutation<void, createApartmentTye>({
            query: ({ title, location, price, bathroom, bedroom, uploaded_images, category, description, facilities, guest }) => {
                const formdata = new FormData()
                formdata.append('title', title)
                formdata.append('location', location)
                formdata.append('price', price)
                formdata.append('bathroom', bathroom.toString())
                formdata.append('bedrooms', bedroom.toString())
                formdata.append('category', category.toString())
                formdata.append('description', description)
                formdata.append('guest', guest.toString())
                facilities.forEach((facility) => {
                    formdata.append('facilities', facility)
                })
                uploaded_images.map((image) => {
                    formdata.append('uploaded_images', image)
                })
                return {
                    url:'/apartment/create/',
                    method: 'POST',
                    body: formdata
                }
            },
            
            onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
               try{
                  await queryFulfilled
                  dispatch(
                     ApartmentSlice.util.invalidateTags([
                        {type:'landlordApartment'},
                        {type:'Apartment'},
                        {type:'ApartmentSearch'},
                        {type:'RelatedApartment'}
                     ])
                  )
               }catch(error){
                console.error('Error during createApartment mutation', error);
               }
            }

        }),
        editApartment:builder.mutation<void,{data:createApartmentTye,id:string|null}>({
            query: ({data:{ 
                title, location, price, bathroom, bedroom, uploaded_images, category, description, facilities, guest
            },id}) => {
                const formdata = new FormData()
                formdata.append('title', title)
                formdata.append('location', location)
                formdata.append('price', price)
                formdata.append('bathroom', bathroom.toString())
                formdata.append('bedrooms', bedroom.toString())
                formdata.append('category', category.toString())
                formdata.append('description', description)
                formdata.append('guest', guest.toString())
                facilities.forEach((facility) => {
                    formdata.append('facilities', facility)
                })
                uploaded_images.map((image) => {
                    formdata.append('uploaded_images', image)
                })
                return {
                    url:`/apartment/update/${id}/`,
                    method: 'PUT',
                    body: formdata
                }
            },
            
            onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
               try{
                  await queryFulfilled
                  dispatch(
                     ApartmentSlice.util.invalidateTags([
                        {type:'landlordApartment'},
                        {type:'Apartment'},
                        {type:'ApartmentSearch'},
                        {type:'RelatedApartment'}
                     ])
                  )
               }catch(error){
                console.error('Error during createApartment mutation', error);
               }
            }  
        }),
        deleteApartment:builder.mutation<void,{id:string}>({
            query:({id})=>({
                url: `/apartment/delete/${id}`,
                method:'DELETE',
            }),

            onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
                 try{
                    await queryFulfilled
                    dispatch(
                       ApartmentSlice.util.invalidateTags([
                          {type:'landlordApartment'},
                          {type:'Apartment'},
                          {type:'ApartmentSearch'},
                          {type:'RelatedApartment'}
                       ])
                    )
                 }catch(error){
                    console.error('Error during createApartment mutation', error);
                 }
            }
        })
    })
})


export const {
    useGetAllApartmentsQuery,
    useGetApartmentByIdQuery,
    useGetRelatedApartmentQuery,
    useSearchApartmentQuery,
    useLandloardApartmentsQuery,
    useCreateApartmentMutation,
    useEditApartmentMutation,
    useDeleteApartmentMutation
} = ApartmentSlice