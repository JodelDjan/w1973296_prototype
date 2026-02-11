from rest_framework.permissions import BasePermission

class IsGeneralUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role == 'general'
        except AttributeError:
            return False