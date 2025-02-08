import django_filters

class UserBookingFilter(django_filters.FilterSet):
     title = django_filters.CharFilter(field_name="apartment__title",lookup_expr='icontains',label='title')
     