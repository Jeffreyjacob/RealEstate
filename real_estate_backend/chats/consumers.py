import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("WebSocket connected!")
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        booking_id = data["booking_id"]
        sender_id = data["sender"]
        recipient_id = data["recipient"]
        timestamp = data['timestamp']

        print("mesage after converting to dict", data["message"])

        self.room_group_name = self.generate_group_name(sender_id, recipient_id)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message":message,
                "sender":sender_id,
                "recipient":recipient_id,
                "booking_id":booking_id,
                'timestamp': timestamp
            },
        )

        chat = await self.save_message(sender_id, recipient_id, message, booking_id)
        return chat

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                    "recipient": event["recipient"],
                    "booking_id": event["booking_id"],
                    'timestamp':event['timestamp']
                }
            )
        )

    @sync_to_async
    def save_message(self, sender, recipient, message, booking_id):
        from chats.models import Chat
        from Bookings.models import Booking
        from django.shortcuts import get_object_or_404
        from users.models import User

        try:
            sender = get_object_or_404(User, id=sender)
            recipient = get_object_or_404(User, id=recipient)
            booking = get_object_or_404(Booking, id=booking_id)
        except Exception as e:
            print(f"Error fetching objects: {e}")
            return None

        chat = Chat.objects.create(
            sender=sender, recipient=recipient, message=message, booking_id=booking
        )
        return chat

    def generate_group_name(self, sender_id, recipient_id):
       sorted_ids = sorted([sender_id, recipient_id])
       return f"chat_{sorted_ids[0]}_{sorted_ids[1]}"

