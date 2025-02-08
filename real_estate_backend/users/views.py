from django.shortcuts import render
from rest_framework.generics import GenericAPIView,UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterUserSerializer,LoginUserSerializer,GetProfileSerializer,EditUserProfileSerializer,PasswordResetRequestSerializer,SetNewPasswordSerializer,GoogleAuthSerializer,LogOutSerializer,FavoriteSerializer
from .utils import send_code_to_user_task
from .models import OneTimePasscode
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Profile
from rest_framework.exceptions import NotFound
from .permissions import IsUserOwnProfile
from rest_framework.views import APIView
from apartments.models import Apartment


# Create your views here.


class RegisterUserView(GenericAPIView):
    serializer_class = RegisterUserSerializer
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = serializer.data
            send_code_to_user_task.delay(user['email'])
            return Response({
                'data':user,
                'message': "hi,thanks for signing up a passcode has been sent to your email to verified your email"
            },status=status.HTTP_201_CREATED)
        if 'email' in serializer.errors:
            return Response({"message": serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            

    
class EmailVerificationView(GenericAPIView):
       
       def post(self,request):
           otpCode = request.data.get('code')
           try:
               user_code_obj = OneTimePasscode.objects.get(code=otpCode)
               user = user_code_obj.user
               if not user.is_verified:
                   user.is_verified = True
                   user.save()
                   user_code_obj.delete()
                   return Response({
                       'message':'account email verified successfully'
                   },status=status.HTTP_200_OK) 
           except OneTimePasscode.DoesNotExist:
                  return Response({
                      "message":"invalid or expired code"
                  },status=status.HTTP_400_BAD_REQUEST) 
                  

class LoginUserView(GenericAPIView):
      serializer_class = LoginUserSerializer
      
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          serializer.is_valid(raise_exception=True)
          return Response(serializer.data,status=status.HTTP_200_OK)
   

class GetUserProfileView(GenericAPIView):  
      serializer_class = GetProfileSerializer
      permission_classes = [IsAuthenticated]
      
      def get(self,request):
          user = request.user
          try:
              profile = Profile.objects.get(user=user)
          except Profile.DoesNotExist:
              raise NotFound(detail='Profile not found for the current user')
          
          serializer = self.serializer_class(profile)
          return Response(serializer.data,status=status.HTTP_200_OK)
              
class EditUserProfileView(UpdateAPIView):
       serializer_class = EditUserProfileSerializer
       permission_classes = [IsUserOwnProfile]
       queryset = Profile.objects.all()
       
       def get_object(self):
            return self.request.user.profile
        
        
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            "message":"a link has been sent to your email to reset your password"
        },status=status.HTTP_200_OK)
        
class SetNewPasswordView(GenericAPIView):
       serializer_class = SetNewPasswordSerializer
       
       def patch(self,request):
          serializer = self.serializer_class(data=request.data)
          serializer.is_valid(raise_exception=True)
          return Response(serializer.data,status=status.HTTP_200_OK)
            
       
class GoogleSignInView(GenericAPIView):
      serializer_class = GoogleAuthSerializer
      
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          serializer.is_valid(raise_exception=True)
          data = ((serializer.validated_data)['access_token'])
          return Response(data,status=status.HTTP_200_OK)
            

class LogOutView(GenericAPIView):
    serializer_class = LogOutSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
       serializer = self.serializer_class(data=request.data)
       serializer.is_valid(raise_exception=True)
       serializer.save()
       
       return Response({"message":"User logged out"},status=status.HTTP_204_NO_CONTENT)
                
class AddOrRemoveFavoriteView(APIView):
      permission_classes = [IsAuthenticated]
      
      def post(self,request,apartmentId):
            try:
               apartment = Apartment.objects.get(id=apartmentId)
            except Apartment.DoesNotExist:
                  return Response({'message':'Apartment with id does not exist'},status=status.HTTP_404_NOT_FOUND)
            
            user = request.user
            
            if user in apartment.favorited.all():
                  apartment.favorited.remove(user)
                  return Response({'message':'Removed from favorite'},status=status.HTTP_200_OK)
            else:
               apartment.favorited.add(user)
               return Response({'message':'Added to favorite'},status=status.HTTP_200_OK)

class GetUserFavoritedApartmentView(APIView):
      
      permission_classes = [IsAuthenticated]
      
      def get(self,request):
            user = request.user
            favorite_apartments = user.favorited_apartments.all()
            serializer = FavoriteSerializer(favorite_apartments,many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
                
                

        
    