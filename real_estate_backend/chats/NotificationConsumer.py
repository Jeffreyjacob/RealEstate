import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from django.shortcuts import get_object_or_404
from django.utils import timezone

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    
    @sync_to_async
    def get_missed_notification(self,user_id):
     
        from chats.models import Notifications
        return list(Notifications.objects.filter(recipient__id=user_id))
    
    async def connect(self):
     try:
      user = self.scope['user']
      if user.is_authenticated:
        self.room_group_name = f"user_{user.id}"
        print(f"WebSocket user: {user}")
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        missed_notification = await self.get_missed_notification(user.id)
        for notification in missed_notification:
            await self.send(text_data=json.dumps({
                "message": notification.message,
                "timestamp": str(notification.timestamp)
            }))
      else:
         self.room_group_name = None  # Ensure this is set even if the user is unauthenticated
         await self.close()
     except Exception as e:
         print(f"Error during WebSocket connection: {e}")
        
    async def disconnect(self, code):
         if hasattr(self, "room_group_name") and self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
    async def receive(self, text_data):
         data = json.loads(text_data)
         message = data["message"]
         sender_id = data["sender"]
         recipient_id = data["recipient"]
         timestamp = data['timestamp']
         
         await self.channel_layer.group_send(
             f'user_{recipient_id}',
             {
                 "type":'booking_notification',
                 "message": message,
                 "sender": sender_id,
                 "recipient": recipient_id,
                 "timestamp": str(timezone.now()),
             }
         )
    
    async def booking_notification(self,event):
        print(f"Received booking notification: {event}")
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                    "recipient": event["recipient"],
                    "timestamp": event["timestamp"],
                }
            )
        )
         
         
    @sync_to_async
    def save_notification(self,message,recipient_id,sender_id):
         from chats.models import Notifications
         from users.models import User
         
         try:
            recipient = get_object_or_404(User, id=recipient_id) 
            notification = Notifications.objects.create(
             message = message,
             recipient = recipient 
            )
         
            return notification
         except Exception as e:
            print(f"Error fetching objects: {e}")
            return None
        
    
         
        
             
          
    