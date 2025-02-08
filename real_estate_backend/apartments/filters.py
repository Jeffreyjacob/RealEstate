import django_filters
from .models import Apartment


class ApartmentFilter(django_filters.FilterSet):
      location = django_filters.CharFilter(field_name='location',lookup_expr='icontains',label="location")
      category = django_filters.ChoiceFilter(field_name="category",choices=Apartment.APARTMENT_CATEGORY,label="category")
      price_min = django_filters.NumberFilter(field_name='price',lookup_expr='gte',label='Min Price')
      price_max = django_filters.NumberFilter(field_name='price',lookup_expr='lte',label='Max Price')
      
      class Meta:
          model = Apartment
          fields = [
              'location',
              'category',
              'price_min',
              'price_max'
          ]
    
    
class UserApartmentFilter(django_filters.FilterSet):
      title = django_filters.CharFilter(field_name='title',lookup_expr='icontains',label='title')