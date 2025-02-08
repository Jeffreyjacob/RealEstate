"use client"
import { MessageType, NotificationType } from "@/lib/types"
import { useAppSelector } from "@/redux/store"
import React, { createContext, SetStateAction, useContext, useEffect, useRef, useState } from "react"


type stateContextType = {
    ChatSocketRef: WebSocket | null,
    AddMessage: MessageType[],
    setAddMessage: React.Dispatch<SetStateAction<MessageType[]>>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_HOST as string

const StateContext = createContext<stateContextType | null>(null);
export const ContextProvider = ({ children }: { children: React.ReactNode }) => {

    const chatSocketRef = useRef<WebSocket | null>(null);
    const notificationSocketRef = useRef<WebSocket | null>(null);
    const [AddMessage, setAddMessage] = useState<MessageType[]>([])
    const { userInfo } = useAppSelector((state) => state.user)
    const [AddNotifications, setAddNotifications] = useState<NotificationType[]>([])

    useEffect(() => {
        if (userInfo) {
            chatSocketRef.current = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/chat/`);
            chatSocketRef.current.onopen = () => {
                console.log("Websocket connection opened")
            }

            chatSocketRef.current.onmessage = (event) => {
                const recievedMessage = JSON.parse(event.data);
                console.log(recievedMessage)
                setAddMessage((prevState: MessageType[]) => [...prevState, recievedMessage])
            }

            chatSocketRef.current.onclose = () => {
                console.log("Websocket connected failed");
            }

            chatSocketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

        }
        return () => {
            if (chatSocketRef.current) {
                chatSocketRef.current.close();
            }
        }

    }, [chatSocketRef, setAddMessage])

    // useEffect(() => {
    //     if (userInfo) {
    //         notificationSocketRef.current = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/notification/`)
    //         notificationSocketRef.current.onopen = () => {
    //             console.log("notification Websocket connection opened")
    //         }
    //         notificationSocketRef.current.onmessage = (event) => {
    //             const data = JSON.parse(event.data)
    //             console.log(data)
    //             setAddNotifications((prevNotifications) => [...prevNotifications, data])
    //         }
    //         notificationSocketRef.current.onclose = () => {
    //             console.error("notification websocket failed")
    //         };
    //         notificationSocketRef.current.onerror = (error) => {
    //             console.error("WebSocket error:", error);
    //         };

    //         return () => {
    //             if (notificationSocketRef.current) {
    //                 notificationSocketRef.current.close()
    //             }
    //         }
    //     }

    // }, [notificationSocketRef, setAddNotifications])

    return (
        <StateContext.Provider value={{ ChatSocketRef: chatSocketRef.current, AddMessage, setAddMessage }}>
            {children}
        </StateContext.Provider>
    )
}


export const useStateContext = () => {
    const context = useContext(StateContext)
    if (context === null) {
        throw new Error("useStateContext must be used within a StateProvider");
    }
    return context
}