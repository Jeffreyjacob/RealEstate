from django.apps import AppConfig


class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Bookings'
    
    def ready(self):
        import Bookings.signals
