from django.db import models
import uuid
from apartments.models import Apartment
from users.models import User

# Create your models here.


class Booking(models.Model):
    
     class BookingStatus(models.TextChoices):
          PENDING = 'Pending'
          PAID = 'Paid'
          CANCELLED = 'Cancelled' 
    
     id = models.UUIDField(primary_key=True,default=uuid.uuid4)
     apartment = models.ForeignKey(Apartment,on_delete=models.SET_NULL,null=True,related_name='bookings')
     start_date = models.DateTimeField()
     end_date = models.DateTimeField()
     number_of_night = models.IntegerField()
     guest = models.IntegerField()
     created_at = models.DateTimeField(auto_now_add=True)
     booking_status = models.CharField(max_length=10,choices=BookingStatus.choices,default=BookingStatus.PENDING)
     user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name='bookings')
     
     @property
     def Total_price(self):
         return self.number_of_night * self.apartment.price
     
     def __str__(self):
          return f"{self.user.full_name} booked apartment with id {self.apartment.id}"
      
    
