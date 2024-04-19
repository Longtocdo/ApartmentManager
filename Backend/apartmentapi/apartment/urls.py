from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apartment import views

r = routers.DefaultRouter()
# r.register('categories', views.CategoryViewSet, basename='categories')
# r.register('apartment', views.CourseViewSet, basename='apartment')
# r.register('lessons', views.LessonViewSet, basename='lessons')
# r.register('users', views.UserViewSet, basename='users')
# r.register('comments', views.CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(r.urls))
]
