from rest_framework import serializers
from .models import Booking
from apartments.models import Apartment
from users.models import User


class BookedUserSerializer(serializers.ModelSerializer):
      class Meta:
          model = User
          fields = [
             'id',
             'email',
             'full_name',
          ]
          
class apartmentBookedSerializer(serializers.ModelSerializer):
       user = BookedUserSerializer()
       class Meta:
           model = Apartment
           fields = [
               'id',
               'title',
               'description',
               'bathroom',
               'bedrooms',
               'price',
               'location',
               'images',
               'category',
               'user'
           ]

class CreateBookingSerializer(serializers.ModelSerializer):
     class Meta:
         model = Booking
         fields = [
             'apartment',
             'start_date',
             'end_date',
             'number_of_night',
             'guest',
         ]
         
     def validate(self, attrs):
         required_fields = ['apartment','start_date','end_date','number_of_night','guest']
         
         for field in required_fields:
             if field not in attrs or not attrs[field]:
                 return serializers.ValidationError(f"{field} is required")     
         return super().validate(attrs)
     
     def create(self, validated_data):
         user = self.context['request'].user
         booking = Booking.objects.create(
             apartment = validated_data['apartment'],
             start_date = validated_data['start_date'],
             end_date = validated_data['end_date'],
             number_of_night = validated_data['number_of_night'],
             guest = validated_data['guest'],
             user = user
         )
         booking.save()
         return booking
     
     
class BookingSerializer(serializers.ModelSerializer):
    apartment = apartmentBookedSerializer()
    user = BookedUserSerializer()
    class Meta:
        model = Booking
        fields = [
            'id',
            'apartment',
            'start_date',
            'end_date',
            'number_of_night',
            'guest',
            'created_at',
            'booking_status',
            'user',
            'Total_price'
        ]
        
        
class CreateCheckoutSerializer(serializers.Serializer):
    nights = serializers.IntegerField()
    guest = serializers.IntegerField()
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    class Meta:
        fields = [
            'nights',
            'guest',
            'start_date',
            'end_date',
            'apartment',
        ]



        
