from django.urls import path
from Bookings import views 
from .webhooks import stripe_webhook

urlpatterns  = [
    path("create/",views.CreateBookingAPIView.as_view(),name='creat_booking'),
    path('landlord/',views.GetBookingByLandloardAPIView.as_view(),name='landlord_booking'),
    path('user/',views.GetBookingByUserAPIView.as_view(),name='userbooking'),
    path('checkout-session/',views.CreateStripeCheckoutSession.as_view(),name='checkout-session'),
    path('stripe-webhook/',stripe_webhook,name='stripe-webhook'),
    path('landlordStatistics/',views.LandlardStaticties.as_view(),name="landlord_staticties"),
    path('update_booking_status/<id>/',views.UpdateBookingStatusAPIView.as_view(),name='update_booking_status'),
    path('<id>/',views.GetBookingByIdAPIView.as_view(),name='booking_details'),
    path('apartmentbooking/<id>/',views.GetApartmentBookingByIdAPIView.as_view(),name="apartment_booking"),
]