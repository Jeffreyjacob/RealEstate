from rest_framework import permissions


class IsUserOwnApartmentToEdit(permissions.BasePermission):
     
      def has_object_permission(self, request, view, obj):
            if request.user.is_authenticated:
                return True
            if request.user == obj.user and  obj.user.role == "LANDLORD":
                return True
            
class IsLandLord(permissions.BasePermission):
    
    def has_permission(self, request, view):
         if request.user.is_authenticated:
             return True
    def has_object_permission(self, request, view, obj):
         if obj.user.role == "LANDLORD":
             return True