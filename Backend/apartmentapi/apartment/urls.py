from django.contrib import admin
from django.urls import include
from rest_framework import routers
from apartment import views
from apartment.admin import admin_site
from django.urls import path
from apartment.admin import admin

r = routers.DefaultRouter()
r.register('residentfee', views.ResidentFeeViewSet, basename='residentfee')
r.register('apartment', views.ApartmentViewSet, basename='apartment')
r.register('residents', views.ResidentViewSet, basename='residents')
r.register('users', views.UserViewSet, basename='users')
r.register('service', views.ServiceViewSet, basename='monthlyfee')
r.register('electroniclocker', views.ElectronicLockerViewSet, basename='electroniclocker')
r.register('report', views.ReportViewSet, basename='report')
r.register('item', views.ItemViewSet, basename='item')
r.register('reservation', views.ReservationViewSet, basename='re')
r.register('survey', views.SurveyViewSet, basename='survey')
r.register('answer', views.AnswerViewSet, basename='answer')
r.register('response', views.ResponseViewSet, basename='response')
r.register('zalopay', views.ZaloViewSet, basename='zalo')
r.register('momo',views.MomoViewSet,basename='momo')
r.register('question', views.QuestionViewSet, basename='question')



urlpatterns = [
    path('', include(r.urls)),
    # path('process_payment/', views.process_payment, name='process_payment'),
    # path('create_payment/', views.create_payment, name='create_payment'),
    # path('zalopay_callback/', views.handle_zalopay_callback, name='zalopay_callback'),
]

