from channels.layers import get_channel_layer
from django.utils import timezone
from asgiref.sync import async_to_sync
from users.models import User
from chats.models import Notifications


# def send_booking_notification_to_owner(message,recipient_id,sender_id): 

#     try:
#         recipient = User.objects.get(id=recipient_id)
#         Notifications.objects.create(
#             message = message,
#             recipient= recipient
#         )
#         print(f"Notification saved for recipient: {recipient_id}")
#     except User.DoesNotExist:
#         print(f"Recipient with ID {recipient_id} does not exist")
#         return 
    
#     channel_layer = get_channel_layer()
#     print(message,recipient_id,sender_id)
#     async_to_sync(channel_layer.group_send)(
#         f"user_{recipient_id}",  # Group name for the owner
#         {
#             "type": "booking_notification",
#             "message": message,
#             "sender": sender_id,
#             "recipient": recipient_id,
#             "timestamp": str(timezone.now()),
#         }
#     )