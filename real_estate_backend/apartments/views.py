from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from apartments import serializers as api_serializer
from rest_framework.generics import GenericAPIView,ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework import status
from apartments.models import Apartment
from rest_framework.pagination import PageNumberPagination
from .permissions import IsUserOwnApartmentToEdit
from .filters import ApartmentFilter,UserApartmentFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
import cloudinary.uploader
from django.shortcuts import get_object_or_404

# Create your views here.


class CreateApartmentView(GenericAPIView):
    
      serializer_class = api_serializer.CreateApartmentSerializer
      permission_classes = [IsAuthenticated]
            
      def post(self,request):
         serializer = self.serializer_class(data=request.data,context={'request':request})
         if serializer.is_valid(raise_exception=True):
             serializer.save()
             return Response(serializer.data,status=status.HTTP_200_OK)
         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ApartmentPagination(PageNumberPagination):
      page_size = 9
      max_page_size = 20       

class GetAllAPartmentView(ListAPIView):
      serializer_class = api_serializer.ApartmentSerializer
      permission_classes = [AllowAny]
      queryset = Apartment.objects.select_related('user')
      pagination_class = ApartmentPagination
      

class GetApartmentDetails(RetrieveAPIView):
    
      serializer_class = api_serializer.ApartmentSerializer
      permission_classes = [AllowAny]
      queryset = Apartment.objects.all()
      lookup_field = 'id'

class EditApartmentView(GenericAPIView):
      serializer_class = api_serializer.EditApartmentSerializer
      permission_classes = [IsUserOwnApartmentToEdit]
      
      def put(self,request,id):
          apartment = get_object_or_404(Apartment,id=id)
          serializer = self.serializer_class(apartment,data=request.data)
          if serializer.is_valid():
              imageUrl = []
              images = request.data.pop('uploaded_images',[])
              for image in images:
                  upload_image = cloudinary.uploader.upload(image)
                  imageUrl.append(upload_image['url'])
                  
              serializer.save(image=imageUrl)
              return Response({"message": "Updated apartment"}, status=status.HTTP_200_OK)
        
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                      
            
class DeleteApartmentView(DestroyAPIView):
      
      serializer_class = api_serializer.ApartmentSerializer
      permission_classes = [IsUserOwnApartmentToEdit]
      queryset = Apartment.objects.all()
      lookup_field = 'id'
      
class GetApartmentListByUser(ListAPIView):
      
      serializer_class = api_serializer.ApartmentSerializer
      permission_classes = [IsAuthenticated]
      pagination_class = ApartmentPagination
      pagination_class.page_size_query_param = 'size'
      filter_backends = (DjangoFilterBackend,)
      filterset_class = UserApartmentFilter
      
      
      def get_queryset(self):
           return Apartment.objects.filter(user=self.request.user).select_related('user')
     

class RelatedApartmentView(RetrieveAPIView):
      
      serializer_class = api_serializer.ApartmentSerializer
      permission_classes = [AllowAny]
      queryset = Apartment.objects.all()
      lookup_field = 'id'
      
      
      def get_object(self):
            return Apartment.objects.get(id=self.kwargs['id'])
      
      def get(self, request, *args, **kwargs):
            apartment = self.get_object()
            related_apartment = Apartment.objects.filter(
                  category= apartment.category
            ).exclude(id=apartment.id)
            serializer = api_serializer.ApartmentSerializer(related_apartment,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
             
      
class SearchApartmentView(ListAPIView):
       queryset = Apartment.objects.all()
       serializer_class = api_serializer.ApartmentSerializer
       filter_backends = (DjangoFilterBackend,)
       filterset_class = ApartmentFilter
       permission_classes = [AllowAny]
       pagination_class = ApartmentPagination
       