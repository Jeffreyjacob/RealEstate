from django.shortcuts import render
from .serializers import CreateBookingSerializer,BookingSerializer,CreateCheckoutSerializer
from rest_framework.response import Response
from rest_framework  import status
from .models import Booking
from rest_framework.generics import GenericAPIView,ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from .permissions import IsLandLordUser
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from apartments.models import Apartment
import stripe
from django.conf import settings
from rest_framework.exceptions import ValidationError
from django.db.models import Sum,F
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserBookingFilter

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateBookingAPIView(GenericAPIView):
      serializer_class = CreateBookingSerializer
      permission_classes = [IsAuthenticated]
      
     
      def post(self,request):
          serializer = self.serializer_class(data=request.data,context={'request':request})
          if serializer.is_valid(raise_exception=True):
              serializer.save()
              return Response(serializer.data,status=status.HTTP_200_OK)
          return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class BookingPagination(PageNumberPagination):
       page_size = 10
       max_page_size = 20      

class GetBookingByLandloardAPIView(ListAPIView):
       serializer_class = BookingSerializer
       permission_classes = [IsLandLordUser]
       queryset = Booking.objects.select_related('user','apartment')
       pagination_class = BookingPagination
       
       def get_queryset(self):
            return super().get_queryset().filter(apartment__user=self.request.user).select_related('user','apartment')
        
class GetBookingByUserAPIView(ListAPIView):
      serializer_class = BookingSerializer
      permission_classes = [IsAuthenticated]
      queryset = Booking.objects.select_related('user','apartment')
      pagination_class = BookingPagination
      filter_backends = (DjangoFilterBackend,)
      filterset_class = UserBookingFilter
      
      def get_queryset(self):
           return super().get_queryset().filter(user=self.request.user).select_related('user','apartment')
       
class UpdateBookingStatusAPIView(GenericAPIView):
       serializer_class = BookingSerializer
       permission_classes = [IsLandLordUser]
       
       
       def put(self,request,id):
           booking = get_object_or_404(Booking,id=id)
           serializer = self.serializer_class(booking,data=request.data,partial=True)
           if serializer.is_valid(raise_exception=True):
               serializer.save()
               return Response(serializer.data,status=status.HTTP_200_OK)
           return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
       
class GetBookingByIdAPIView(RetrieveAPIView):
       serializer_class = BookingSerializer
       permission_classes = [IsAuthenticated]
       queryset = Booking.objects.select_related('user','apartment')
       lookup_field = 'id'
       
       
class CreateStripeCheckoutSession(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateCheckoutSerializer
    
    def post(self,request):
       serializer = self.serializer_class(data=request.data)    
       try:
         serializer.is_valid(raise_exception=True)
         apartment =  Apartment.objects.get(id=request.data['apartment'])
         checkout_session = stripe.checkout.Session.create(
             mode='payment',
             customer_email= request.user.email,
             line_items=[
                 {
                  'price_data':{
                      'currency':'usd',
                      'product_data':{
                         'name':apartment.title,
                         'images':[apartment.images[0]],
                      },
                      'unit_amount':int(apartment.price * 100)
                  },
                  'quantity':request.data.get('nights',1)
                 }
             ],
             metadata={
                 'user_id': request.user.id,
                 'apartment_id':apartment.id,
                 'guest':request.data['guest'],
                 'start_date':request.data['start_date'],
                 'quantity':request.data['nights'],
                 'end_date':request.data['end_date']
             },
             success_url=f"{settings.FRONTEND_URL}/reservations",
             cancel_url=f"{settings.FRONTEND_URL}/apartmentDetail/{apartment.id}"
         )
         return Response({'url':checkout_session.url},status=status.HTTP_200_OK)
       except Apartment.DoesNotExist:
           return Response({'error':'Apartment not found'},status=status.HTTP_404_NOT_FOUND)
       except Exception as e: 
           return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetApartmentBookingByIdAPIView(ListAPIView):
      serializer_class = BookingSerializer
      permission_classes = [AllowAny]
      queryset = Booking.objects.select_related('user','apartment')
      
      def get_queryset(self):
        apartment_id = self.kwargs.get('id')
        if not apartment_id:
            raise ValidationError({"message": "Apartment ID not found"})
        
        get_object_or_404(Apartment, id=apartment_id)  # Ensure apartment exists
        return super().get_queryset().filter(apartment__id=apartment_id,booking_status="Paid")
    
    
class LandlardStaticties(GenericAPIView):
      permission_classes = [IsLandLordUser]
      
      def get(self,request):
          bookings = Booking.objects.filter(apartment__user=request.user)
          BookedApartment = bookings.filter(booking_status='Paid')
          CancelledApartment = bookings.filter(booking_status='Cancelled')
          totalAmount = bookings.filter(booking_status='Paid').aggregate(
              total=Sum(F('number_of_night') * F('apartment__price'))
              )['total']
          
          return Response({
              "booked_apartment":BookingSerializer(BookedApartment,many=True).data,
              "cancelled_apartment":BookingSerializer(CancelledApartment,many=True).data,
              'total_amount':totalAmount or 0
          }) 
          
          
        
    
