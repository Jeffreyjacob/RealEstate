import { MessageType, UserChatType } from "@/lib/types";
import { apiSlice } from "@/services/apiservice";

export const MessageApiSlice = apiSlice.injectEndpoints({
      endpoints: builder =>({
        getAllMessage: builder.query<MessageType[],{id:string}>({
           query:({id})=>({
            url:`/chat/allChatMessage/${id}`,
            method:'GET'
           }),
           keepUnusedDataFor: 0,
        }),
        userChat: builder.query<UserChatType[],void>({
           query:()=>({
             url:"/chat/userChats",
             method:"GET"
           }),
           keepUnusedDataFor:0
        }),
        markAsRead: builder.mutation<void,{id:string}>({
          query: ({id})=>({
            url: `/chat/markasread/${id}/`,
            method:'PATCH'
          })
        })
      })
})

export const {useGetAllMessageQuery,
  useUserChatQuery,useMarkAsReadMutation
} = MessageApiSlice
