from rest_framework import permissions


class AdminOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser


class ReportOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, report):
        return super().has_permission(request, view) and request.user == report.resident.user_info
