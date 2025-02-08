from rest_framework import permissions


class IsLandLordUser(permissions.BasePermission):
    
     def has_permission(self, request, view):
         if request.user.is_authenticated and request.user.role == "LANDLORD":
           return True
         return False
     def has_object_permission(self, request, view, obj):
          if request.method in permissions.SAFE_METHODS:
              return True
          if request.user == obj.apartment.user:
              return True
          return False