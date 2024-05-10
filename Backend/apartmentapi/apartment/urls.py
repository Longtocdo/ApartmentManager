from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apartment import views

r = routers.DefaultRouter()
r.register('residentfee', views.ResidentFeeViewSet, basename='residentfee')
r.register('apartment', views.ApartmentViewSet, basename='apartment')
r.register('residents', views.ResidentViewSet, basename='residents')
r.register('users', views.UserViewSet, basename='users')
r.register('monthlyfee', views.MonthlyFeeViewSet, basename='monthlyfee')
r.register('electroniclocker', views.ElectronicLockerViewSet, basename='electroniclocker')
r.register('reflection', views.ReflectionViewSet, basename='reflection')
r.register('item', views.ItemViewSet, basename='item')
r.register('re', views.ReViewSet, basename='re')


urlpatterns = [
    path('', include(r.urls))
]
