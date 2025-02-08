from django.db import models
from users.models import User
from Bookings.models import Booking
# Create your models here.


class Chat(models.Model):
     
      sender = models.ForeignKey(User,related_name='sent_message',on_delete=models.CASCADE)
      recipient = models.ForeignKey(User,related_name='recieved_message',on_delete=models.CASCADE)
      message = models.TextField()
      isRead =  models.BooleanField(default=False)
      booking_id = models.ForeignKey(Booking,on_delete=models.CASCADE)
      timestamp = models.DateTimeField(auto_now_add=True)
      
      
      class Meta:
          ordering = ['timestamp']
          
      def __str__(self):
           return f"From {self.sender.full_name} to {self.recipient.full_name}"
       
       
class Notifications(models.Model):

      message = models.TextField()
      isRead = models.BooleanField(default=False)
      recipient = models.ForeignKey(User,on_delete=models.CASCADE,related_name="recievedNotification")
      created_at = models.DateTimeField(auto_now_add=True)
      
      
      def __str__(self):
           return f"{self.message}"