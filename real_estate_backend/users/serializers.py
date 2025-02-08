from rest_framework import serializers
from .models import User,Profile
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import smart_str,smart_bytes,force_str
from .utils import generate_reset_url,send_resetpassword_email_task,Google,register_social_user
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from apartments.models import Apartment 
import cloudinary
import cloudinary.uploader


class RegisterUserSerializer(serializers.ModelSerializer):
      password = serializers.CharField(max_length=80,min_length=7,write_only=True)
    
      class Meta:
          model = User
          fields = [
              'email',
              'full_name',
              'password',
              'role'
          ]
      def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({"message": "email already exists"})
        return value
       
      def create(self, validated_data):
         user = User.objects.create(
             email= validated_data['email'],
             full_name = validated_data['full_name'],
             role = validated_data['role']
         )
         user.set_password(validated_data['password'])
         user.save()
         return user
     
class LoginUserSerializer(serializers.ModelSerializer):
      email = serializers.EmailField()
      password = serializers.CharField(max_length=80,min_length=7,write_only=True)
      full_name = serializers.CharField(read_only=True)
      access_token = serializers.CharField(read_only=True)
      refresh_token = serializers.CharField(read_only=True)
      id = serializers.IntegerField(read_only=True)
      role = serializers.CharField(read_only=True)
      
      class Meta:
          model= User
          fields = [
              'email',
              'password',
              'full_name',
              'access_token',
              'refresh_token',
              'id',
              'role'
          ]
          
      def validate(self, attrs):
           email = attrs.get('email')
           password = attrs.get('password')
           
           user = authenticate(email=email,password=password)
           if not user:
               raise AuthenticationFailed("invalid credentials,try again")
           if not user.is_verified:
               raise AuthenticationFailed("email is not verified, Please verify email before logging in")
           user_token = user.tokens()
           return { 
               'id':user.id,
               'email': user.email,
               'full_name': user.get_full_name,
               'role':user.get_role,
               'access_token':str(user_token.get('access')),
               'refresh_token': str(user_token.get('refresh'))
           }
           return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
     class Meta:
         model = User
         fields = [
             'id',
             'email',
             'full_name',
             'role'
         ]
         
       
class GetProfileSerializer(serializers.ModelSerializer):
        
         user = UserSerializer()    
         class Meta:
             model = Profile
             fields = [
                 'user',
                 'phone_number',
                 'nationality',
                 'current_address',
                 'gender',
                 'image'
             ]
             

class EditUserProfileSerializer(serializers.ModelSerializer):
       uploadedImage = serializers.FileField(write_only=True)
       image = serializers.CharField(read_only=True)
       class Meta:
           model = Profile
           fields = [
                 'phone_number',
                 'nationality',
                 'current_address',
                 'gender',
                 'image',
                 'uploadedImage',
           ]
        
       def update(self, instance, validated_data):
             updated_image = validated_data.pop('uploadedImage',None)
             if updated_image:
                 try:
                    cloudinary_response = cloudinary.uploader.upload(updated_image)
                    cloudinary_url = cloudinary_response.get('secure_url')
                    instance.image = cloudinary_url
                 except Exception as e:
                      raise serializers.ValidationError({"uploadedImage": f"Image upload failed: {str(e)}"})
                 
             for attr, value in validated_data.items():
              setattr(instance, attr, value)

             # Save and return the updated profile instance
             instance.save()
             return instance
        
       
class  PasswordResetRequestSerializer(serializers.Serializer):
       email = serializers.EmailField(max_length=255)
       
       class Meta:
           fields = ['email']
        
       def validate(self, attrs):
            email = attrs.get('email')
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                request = self.context.get('request')
                abslink = generate_reset_url(uidb64,token)
                send_resetpassword_email_task.delay(user.email,abslink,user.full_name)
                
            return super().validate(attrs)  
        
        
        
class SetNewPasswordSerializer(serializers.Serializer):
      password = serializers.CharField(max_length=80,min_length=7,write_only=True)
      confirm_password = serializers.CharField(max_length=80,min_length=7,write_only=True)
      uidb64 = serializers.CharField(write_only=True)
      token = serializers.CharField(write_only=True)
      
      class Meta:
          fields = [
              'password',
              'confirm_password',
              'uidb64',
              'token'
          ]
      
      def validate(self, attrs):
        try:  
          token = attrs.get('token')
          uidb64 = attrs.get('uidb64')
          password = attrs.get('password')
          confirm_password = attrs.get('confirm_password')
          
          user_id = force_str(urlsafe_base64_decode(uidb64))
          user = User.objects.get(id=user_id)
          if not PasswordResetTokenGenerator().check_token(user,token):
              raise AuthenticationFailed('reset link is invalid or has expired')
          if password != confirm_password:
              raise AuthenticationFailed('password do not match')
          user.set_password(password)
          user.save()
          return user 
        except Exception as e:
            return AuthenticationFailed('link is invalid or has expired')


class GoogleAuthSerializer(serializers.Serializer):
       access_token = serializers.CharField(min_length=6)
       
       def validate_access_token(self,access_token):
           google_user_data = Google.validate(access_token)
           try:
              user_id = google_user_data['sub'] 
           except:
                raise serializers.ValidationError('this token is invalid or has expired')
            
            # check to validate the client making the request, if it's from google
           if google_user_data['aud'] != settings.GOOGLE_CLIENT_ID:
                raise AuthenticationFailed(detail='could not verify user')
           email = google_user_data['email']
           full_name = google_user_data['given_name']
           provider = "google"
           
           return register_social_user(provider,email,full_name)
       
class LogOutSerializer(serializers.Serializer):
       refresh = serializers.CharField()
        
       default_error_messages = {
           'bad_token':{'token is expired or invalid'}
       }
       
       def validate(self, attrs):
            self.token = attrs['refresh']
            return super().validate(attrs)
       
       def save(self, **kwargs):
           try:
               RefreshToken(self.token).blacklist()
           except InvalidToken as e:
               self.fail('bad token')
               
class FavoriteSerializer(serializers.ModelSerializer):
       
      class Meta: 
       model =Apartment
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
       ]
       