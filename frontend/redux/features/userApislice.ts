import { UserType } from "@/lib/types";
import { apiSlice } from "@/services/apiservice";
import { ApartmentSlice } from "./apartmentApislice";


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query:({email,password,full_name,role})=>({
                url:'/auth/register/',
                method:'POST',
                body: {email,password,full_name,role}
            })
        }),
        verifyEmail: builder.mutation({
           query:({code})=>({
              url:'/auth/verify_email/',
              method:'POST',
              body:{code}
           })
        }),
        login: builder.mutation({
            query:({email,password})=>({
               url: '/auth/login/',
               method: 'POST',
               body:{email,password}
            }),
        
        }),
        sendPasswordResetEmail: builder.mutation({
            query:({email})=>({
                url:'/auth/password_reset/',
                method:'POST',
                body: {email}
            })
        }),
        resetPassword: builder.mutation({
            query: ({password,confirm_password,uidb64,token})=>({
                url:'/auth/setNewPassword/',
                method:'PATCH',
                body:{password,confirm_password,uidb64,token}
            })
        }),
        logout: builder.mutation({
            query: ({refresh})=>({
                url:'/auth/logout/',
                method:'POST',
                body: {refresh}
            })
        }),
        google: builder.mutation({
            query:({access_token})=>({
                url:'/auth/google/',
                method:'POST',
                body:{access_token}
            })
        }),
        getUser: builder.query<UserType,void>({
            query: ()=> '/auth/getProfile'
        }),
        updateUser: builder.mutation({
            query:({gender,phone_number,nationality,current_address,uploadedImage})=>{
                const formData = new FormData();
    
                // Append text fields (non-file) to FormData
                formData.append('gender', gender);
                formData.append('phone_number', phone_number);
                formData.append('nationality', nationality);
                formData.append('current_address', current_address);
                
                // Append the image file if present
                if (uploadedImage) {
                  formData.append('uploadedImage', uploadedImage); // Ensure 'uploadedImage' is a file
                }
                return {
                    url: '/auth/profile/update/',
                    method: 'PUT',
                    body: formData 
                }
            }
        }),
        addFavorite: builder.mutation({
            query:({apartmentId})=>({
                url: `/auth/addFavorite/${apartmentId}/`,
                method:'POST',
            }),
            onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
                try{
                    await queryFulfilled;
                    console.log('Invalidating tags:', args.apartmentId);
                    dispatch(
                        ApartmentSlice.util.invalidateTags([
                          {type:'Apartment'},
                        //   {type:'RelatedApartment',id: args.apartmentId},
                          {type:'ApartmentSearch'}
                        ])
                      );
                }catch(error){
                    console.error('Error during addFavorite mutation', error);
                }
            }
        })
    })
})


export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyEmailMutation,
    useSendPasswordResetEmailMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useGoogleMutation,
    useGetUserQuery,
    useAddFavoriteMutation,
    useUpdateUserMutation,
} = authApiSlice