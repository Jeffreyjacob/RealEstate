from django.http import JsonResponse
import stripe
from django.conf import settings
import stripe.error
import stripe.webhook
from .models import Booking
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from apartments.models import Apartment
from users.models import User


stripe.api_key = settings.STRIPE_SECRET_KEY


def handle_checkout_session(session):
    metadata = session.get('metadata',{})
    user_id = metadata.get('user_id')
    apartment_id = metadata.get('apartment_id')
    guest = metadata.get('guest')
    start_date = metadata.get('start_date')
    end_date = metadata.get('end_date')
    nights = metadata.get('quantity')
    
    apartment = get_object_or_404(Apartment,id=apartment_id)
    user = get_object_or_404(User,pk=user_id)

    booking =Booking.objects.create(
        apartment = apartment,
        user = user,
        number_of_night = nights,
        guest = guest,
        start_date = start_date,
        end_date = end_date,
        booking_status = 'Paid' if session['payment_status'] == 'paid' else 'Cancelled'
    )
    booking.save()

@csrf_exempt   
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get('Stripe-signature','')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    
    try:
        event = stripe.Webhook.construct_event(payload,sig_header,endpoint_secret)
    except ValueError:
        return JsonResponse({'error':'Invalid Payload'},status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error':'Invalid signature'},status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)
        
    return JsonResponse({'status':'success'})
    
    
    
