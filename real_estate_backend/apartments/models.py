from django.db import models
from users.models import User
import uuid

# Create your models here.

class Apartment(models.Model):
    
    APARTMENT_CATEGORY = (
        ('Room','Room'),
        ('Apartment','Apartment'),
        ('Cabin','Cabin'),
        ('Beach House','Beach House'),
        ('Mansion','Mansion'),
        ('CountrySide','CountrySide'),
        ('Lake House','Lake House'),
        ('Castle','Castle'),
        ('Camper','Camper')
    )
    
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    title = models.CharField(max_length=350)
    description = models.TextField()
    bathroom = models.IntegerField()
    bedrooms = models.IntegerField()
    location = models.CharField(max_length=350)
    price = models.DecimalField(max_digits=8,decimal_places=2)
    category = models.CharField(choices=APARTMENT_CATEGORY,max_length=200)
    guest = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    images = models.JSONField(default=list,blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="apartments")
    facilities = models.JSONField(default=list, blank=True)
    favorited = models.ManyToManyField(User,related_name="favorited_apartments",blank=True)
    
    
    def __str__(self):
        return f"{self.title}"
    
    


    
    

