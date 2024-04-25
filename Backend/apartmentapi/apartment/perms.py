from rest_framework import permissions


class ReflectionOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, reflection):
        return super().has_permission(request, view) and request.user == reflection.user
