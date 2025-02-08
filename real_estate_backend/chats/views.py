from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .serializers import UserChatSerializer,GetAllMessageSerializer
from rest_framework.permissions import IsAuthenticated
from Bookings.models import Booking
from django.shortcuts import get_object_or_404
from .models import Chat
from django.db.models import Q,Max,F
# Create your views here.

class GetAllMessageAPIView(GenericAPIView):
       
       serializer_class = GetAllMessageSerializer
       permission_classes = [IsAuthenticated]
       
       def get(self,request,booking_id):
           booking = get_object_or_404(Booking,id=booking_id)
           
           if booking:
                chat = Chat.objects.filter(booking_id=booking_id).order_by('timestamp')
                serializer = self.serializer_class(chat,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)
           else:
               return Response({'message':'Booking id or request does not exist'},status=status.HTTP_400_BAD_REQUEST)
           

class UserChatAPIView(GenericAPIView):
      permission_classes= [IsAuthenticated]
      
      def get(self,request):
         chats = Chat.objects.filter(
             Q(sender=request.user) | Q(recipient=request.user)
         ).order_by("-timestamp")
         
         users = {}
    
         
         for chat in chats:
             other_user = chat.recipient if chat.sender == request.user else chat.sender             
             if other_user.id not in users:
                latest_chat = Chat.objects.filter(
                    (Q(sender=request.user,recipient=other_user) |
                     Q(sender=other_user,recipient=request.user))
                ).order_by('-timestamp').first()
                last_received_chat = Chat.objects.filter(
                    recipient=request.user,
                    sender=other_user
                ).order_by('-timestamp').first()
                
                
                users[other_user.id] = {
                    'full_name': other_user.full_name,
                    'last_message': latest_chat.message if latest_chat else '',
                    'timestamp': latest_chat.timestamp.isoformat() if latest_chat else '',
                    'is_read':last_received_chat.isRead if last_received_chat else True,
                    'booking_id': latest_chat.booking_id.id,
                    'recipient_id': other_user.id,
                    'sender':latest_chat.sender.id,
                    'profileImage': other_user.profile.image
                }
         sorted_users = sorted(users.values(), key=lambda x: x['timestamp'], reverse=True)
         return Response(sorted_users,status=status.HTTP_200_OK)


class MarkAsReadAPIView(GenericAPIView):
      permission_classes = [IsAuthenticated]
      def patch(self,request,booking_id):
           recipient = request.user
           unread_message = Chat.objects.select_related('recipient','booking_id').filter(
               booking_id__id =booking_id,
               recipient=request.user,
           )            
           print(f"{unread_message.count()}")
           unread_message.update(isRead=True)
           
           return Response({"message":" Message Marked as read"})
       

