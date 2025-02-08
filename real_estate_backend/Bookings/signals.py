from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking
# from .utils import send_booking_notification_to_owner


@receiver(post_save,sender=Booking)
def send_booking_notification(sender,instance,created,**kwargs):
     if created:
         owner_id = instance.apartment.user.id
         apartment_name = instance.apartment.title
         sender_id = instance.user.id
         message = f"New booking recieved for your apartment: {apartment_name}"
         
        #  send_booking_notification_to_owner(message,owner_id,sender_id)