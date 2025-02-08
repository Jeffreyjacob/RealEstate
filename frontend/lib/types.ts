import olivia from "@/assets/olivia.png"
import phoenix from "@/assets/phoenix.png"
import lana from '@/assets/lana.png'
import demi from "@/assets/demi.png"
import candice from "@/assets/candice.png"
import natali from "@/assets/natali.png"
import drew from "@/assets/drew.png"
import orlando from "@/assets/orlando.png"

export const MainLink = [
  { name: "Home", url: "/" },
  { name: "About us", url: "/aboutus" },
  { name: "Erasmus Life", url: "#" }
]

export const ReservationProcess = [
  { title: "Pick a few places", content: "Explore hundreds of high-quality rooms, studios, and apartments. Save favorites and book it. Finding your dream home could not be easier!" },
  { title: "Accepting a reservation", content: "You will receive the acceptance of the reservation from the owner in just a couple of hours. You will not have to wait long for an answer and torment yourself with guesses." },
  { title: "Payment", content: "All that is necessary after receiving a response, is to send the payment and you are almost at the finish line!" },
  { title: "Get your Keys!", content: " Your accommodation is reserved, get ready to move as soon as possible and check in on your chosen date." },
]

export const Navigation = [
  { link: "About us" },
  { link: "FAQ" },
  { link: "Erasmusa lifa lisboa" },
  { link: "Apply for internship" },
]

export const Tenants = [
  { link: "Video Chat" },
  { link: "Housing Guide" },
  { link: "Terms & Conditions" },
  { link: "Privacy Policy" },
]

export const Resouce = [
  { link: "Travessa Cara 14, 1200 - 089 lisbon - Portugal" },
  { link: "+351 932 483 834" },
  { link: "hello@erasmuslifehousing.com" },
]

export const Team  = [
  {name:"Olivia Rhye",role:"Founder & CEO",image:olivia},
  {name:"Phoenix Baker",role:"Engineering Manager",image:phoenix},
  {name:"Lana Steiner",role:"Product Manager",image:lana},
  {name:"Demi Wilkinson",role:"Frontend Developer",image:demi},
  {name:"Candice Wu",role:"Backend Developer",image:candice},
  {name:"Natali Craig",role:"Product Designer",image:natali},
  {name:"Drew Cano",role:"UX Researcher",image:drew},
  {name:"Orlando Diggs",role:"Customer Success",image:orlando},
]

export type UserType = {
  user: {
    id: number
    email: string
    full_name: string
    role: string
  }
  phone_number: string
  nationality: string
  current_address: string
  gender: string
  image: string
}

export type ApartmentType = {
  bathroom: number
  bedrooms: number
  category: string
  description: string
  facilities: string[]
  favorited: number[]
  guest: number
  id: string
  images: string[]
  location: string
  price: string
  title: string
  created_at: string
  user:{
    id:number
    email:string,
    full_name:string
  }
}

export const CreateFormDefaultValue = {
  title: '',
  description: '',
  bathroom: '1',
  location: '',
  price: '',
  bedroom: '1',
  guest: '1',
  category: '',
  uploaded_images: [],
  facilities:[]
}


export type AddressResponse = {
  results: {
          country:string,
          country_code:string,
          state:string,
          county:string,
          postcode:string,
          suburb:string,
          street:string,
          datasource: {
              sourcename:string,
              attribution:string,
              license:string,
              url: string
          },
          lon:number,
          lat:number,
          housenumber:string,
          result_type:string,
          city:string,
          formatted:string,
          address_line1:string,
          address_line2:string,
          timezone: {
              name:string,
              offset_STD:string,
              offset_STD_seconds:number,
              offset_DST:string,
              offset_DST_seconds:number,
              abbreviation_STD:string,
              abbreviation_DST:string
          }
      }[],
  query: {
      text:string,
      parsed: {
          housenumber:string,
          street:string,
          expected_type:string
      }
  }
}

export const categoryOptions = [
    {name:'room',value:'Room'},
    {name:'apartment',value:'Apartment'},
    {name:'cabin',value:'Cabin'},
    {name:'beach House',value:'Beach House'},
    {name:'mansion',value:'Mansion'},
    {name:'countrySide',value:'CountrySide'},
    {name:'lake House',value:'Lake House'},
    {name:'castle',value:'Castle'},
    {name:'camper',value:'Camper'}
]

export type CreateCheckoutSessionInput = {
   nights:number,
   guest:number,
   start_date:Date,
   end_date:Date,
   apartment:string
}

export type BookingListType = {
   id:string
   apartment:ApartmentType
   start_date:string
   end_date:string
   number_of_night:number
   guest:number
   created_at:string
   booking_status:string
   user:{
     id:string,
     email:string
     full_name:string
   }
   Total_price:number
}

export type LandlordStatistics = {
  booked_apartment:BookingListType[]
  cancelled_apartment:BookingListType[],
  total_amount:number
}

export type MessageType = {
  recipient:number,
  sender:number,
  message:string,
  booking_id:string,
  timestamp:string
}

export type UserChatType = {
    full_name:string
    last_message:string
    timestamp:string,
    is_read: boolean
    booking_id:string,
    recipient_id:number,
    profileImage:string
    sender:number
}

export type NotificationType = {
   message:string
   isRead:boolean
   recipient:number
   created_at:string
}