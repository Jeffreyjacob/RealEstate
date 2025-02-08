import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
   } from '@reduxjs/toolkit/query';
import {Mutex} from 'async-mutex';
import { setAccessToken,logout } from '@/redux/features/userSlice';
import { RootState } from '@/redux/store';



interface RefreshTokenResponse {
    access: string;  // The access token returned from the refresh endpoint
}

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api/v1/`,
    credentials:'include',
    prepareHeaders:(headers,{getState,endpoint})=>{
        const state = getState() as RootState;
        const token = state.user.accessToken

        if(token && endpoint !== "getAllApartments" && endpoint !== "getApartmentById" ){
            headers.set('Authorization', `Bearer ${token}`);
        }
     return headers
    }
});

const baseQueryWithReauth: BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError> = async (args,api,extraOptions) =>{

    const state = api.getState() as RootState;; 
    const refresh_token = state.user.refreshToken
      await mutex.waitForUnlock();
      let result = await baseQuery(args,api,extraOptions);

      if(result.error && result.error.status == 401){
          if(!mutex.isLocked()){
              const release = await mutex.acquire();
              try{
                const refreshResult = await baseQuery({
                    url:'/auth/token/refresh/',
                    method: 'POST',
                    body: {refresh:refresh_token}
                },
                api,
                extraOptions)

                if (refreshResult.data){
                    const data = refreshResult.data as RefreshTokenResponse
                    console.log(data)
                    api.dispatch(setAccessToken({
                        accessToken: data.access
                    }))
                    result = await baseQuery(args, api, extraOptions);
                }else{
                    console.log("refresh failed.");
                    api.dispatch(logout())                    
                }
              }finally{
                release()
              }
          }else{
            await mutex.waitForUnlock();
            result = await baseQuery(args,api,extraOptions)
          }
      }
      return result
}


export const apiSlice = createApi({
     reducerPath:'api',
     baseQuery: baseQueryWithReauth,
     tagTypes: ['Apartment', 'RelatedApartment','ApartmentSearch','landlordApartment','landlordbooking','userbooking','apartmentBookings'],
     endpoints: builder => ({})
})

