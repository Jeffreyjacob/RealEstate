from rest_framework import serializers
from .models import Chat,Notifications
from users.models import User


class UserSerializer(serializers.ModelSerializer):
       class Meta:
           model = User
           fields = [
               'id',
               'full_name',
               'email'
           ]


class GetAllMessageSerializer(serializers.ModelSerializer):
       class Meta:
           model = Chat
           fields = [
               'sender',
               'recipient',
               'message',
               'booking_id',
               'timestamp'
           ]
           
class UserChatSerializer(serializers.Serializer):
       full_name = serializers.CharField()
       last_message = serializers.CharField()
       timestamp = serializers.DateTimeField()
       class Meta:
           fields = [
               'full_name',
               'last_message',
               'timestamp'
           ]
           

    

