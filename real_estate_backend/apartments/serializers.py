from rest_framework import serializers
from apartments.models import Apartment
from cloudinary.models import CloudinaryField
import cloudinary.uploader
from django.core.files.uploadedfile import InMemoryUploadedFile
from users.models import User

class CreateApartmentSerializer(serializers.ModelSerializer):
      facilities = serializers.ListField(child=serializers.CharField(max_length=200),required=False)
      uploaded_images = serializers.ListField(child=serializers.FileField(),required=False,write_only=True)
      images = serializers.ListField(child=serializers.CharField(),required=False,read_only=True)
      class Meta:
          model = Apartment
          fields = [
              'title',
              'description',
              'bathroom',
              'bedrooms',
              'location',
              'price',
              'category',
              'images',
              'uploaded_images',
              'guest',
              'facilities'
          ]
          
      def validate(self, attrs):
        required_fields = ['title', 'price', 'category', 'guest', 'bathroom', 'bedrooms', 'location']
        
        for field in required_fields:
            if field not in attrs or not attrs[field]:
                 raise serializers.ValidationError(f"{field} is required and can not be empty")
             
        images = attrs.get('uploaded_images',[])
        if not isinstance(images,list):
            raise serializers.ValidationError('image must be a list')
        for image in images:
            if not isinstance(image,InMemoryUploadedFile):
                 raise serializers.ValidationError(f"Each image must be a valid file. Found: {type(image)}")
        
        
        # Check for valid facilities (if provided)
        facilities = attrs.get('facilities',[])
        if not isinstance(facilities,list):
           raise serializers.ValidationError("Facilities must be a list of values.")
        for facitity in facilities:
            if not isinstance(facitity,str) or not facitity.strip():
                raise serializers.ValidationError('Each facility must be a non-empty string')
    
        return super().validate(attrs)
    
      
      def create(self, validated_data):
          user = self.context['request'].user
          
          facilities = validated_data.pop('facilities',[])
          images_data = validated_data.pop('uploaded_images',[])
           
          image_url = []
          for image in images_data:
              upload_image = cloudinary.uploader.upload(image)
              image_url.append(upload_image['url'])
                     
          apartment = Apartment.objects.create(user=user,**validated_data)
          apartment.facilities = facilities
          apartment.images = image_url
          apartment.save()
          return apartment
 
class UserSubSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = [
                'id',
                'email',
                'full_name'
            ]
      
class  ApartmentSerializer(serializers.ModelSerializer):
      user = UserSubSerializer()
      class Meta:
          model = Apartment
          fields = [
              'id',
              'title',
              'description',
              'bathroom',
              'bedrooms',
              'location',
              'price',
              'category',
              'images',
              'guest',
              'facilities',
              'user',
              'favorited',
              'created_at'
          ]

class EditApartmentSerializer(serializers.ModelSerializer):
       facilities = serializers.ListField(child=serializers.CharField(max_length=200),required=False)
       uploaded_images = serializers.ListField(child=serializers.FileField(),required=False,write_only=True)
       images = serializers.ListField(child=serializers.CharField(),required=False,read_only=True)
       
       class Meta:
           model = Apartment
           fields =  [
              'title',
              'description',
              'bathroom',
              'bedrooms',
              'location',
              'price',
              'category',
              'images',
              'guest',
              'facilities',
              'uploaded_images'
          ]
           



