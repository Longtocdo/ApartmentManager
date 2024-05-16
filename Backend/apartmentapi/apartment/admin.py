import cloudinary
from django.contrib import admin
from django.db.models import Count, Sum
from django.template.response import TemplateResponse
from django.utils.html import mark_safe
from apartment.models import *
from django.urls import path
from django import forms
from django.utils.dateparse import parse_date


# class ApartmentAdminSite(admin.AdminSite):
#     site_header = 'Apartment Management'
#
#     def get_urls(self):
#         return [path('apartment-stats/', self.stats_view)] + super().get_urls()

class ApartmentAdminSite(admin.AdminSite):
    site_header = 'Apartment Management'

    def get_urls(self):
        return [path('apartment-stats/', self.stats_view, name='apartment-stats')] + super().get_urls()

    def stats_view(self, request):
        selected_month = request.GET.get('month')

        if selected_month:
            selected_date = parse_date(selected_month)
            if selected_date:
                resident_fees = ResidentFee.objects.filter(
                    payment_date__month=selected_date.month,
                    payment_date__year=selected_date.year,
                    status=True
                )
                total_paid_amount = resident_fees.aggregate(Sum('amount'))['amount__sum'] or 0
            else:
                resident_fees = []
                total_paid_amount = 0
        else:
            resident_fees = []
            total_paid_amount = 0

        return TemplateResponse(request, 'admin/stats.html', {
            'resident_fees': resident_fees,
            'total_paid_amount': total_paid_amount,
        })


admin_site = ApartmentAdminSite(name='apartment')



class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'


class ResidentAdmin(admin.ModelAdmin):
    list_display = ['user_infor', ]
    search_fields = ['user_infor__first_name', 'user_infor__last_name']


class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'floor', 'room', 'resident']
    search_fields = ['name']
    list_filter = ['floor', 'room']


class MonthlyFeeAdmin(admin.ModelAdmin):
    list_display = ['fee_name', 'price']
    search_fields = ['fee_name']


class ResidentFeeAdmin(admin.ModelAdmin):
    list_display = ['payment_method', 'payment_proof', 'payment_date', 'status', 'amount', 'resident',
                    'fee']
    search_fields = ['payment_method', 'resident__user_infor__first_name', 'resident__user_infor__last_name']
    list_filter = ['payment_date', 'status', ]


class ReservationVehicleAdmin(admin.ModelAdmin):
    list_display = ['vehicle_number', 'status']
    search_fields = ['vehicle_number']
    list_filter = ['status']


class ElectronicLockerItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'apartment']
    search_fields = ['name']
    list_filter = ['status']


class ItemAdmin(admin.ModelAdmin):
    list_display = ['status', 'item_name', 'electronic_lock', 'received_date']
    search_fields = ['item_name']
    list_filter = ['status']


class SurveyAdmin(admin.ModelAdmin):
    list_display = ['tittle', 'data_expire', 'status']
    search_fields = ['tittle']
    list_filter = ['data_expire', 'status']


class QuestionAdmin(admin.ModelAdmin):
    list_display = ['survey', 'content']
    search_fields = ['content']
    list_filter = ['survey']


class ChoiceAdmin(admin.ModelAdmin):
    list_display = ['question', 'content', 'letter']
    search_fields = ['content']
    list_filter = ['question']


class ResponseAdmin(admin.ModelAdmin):
    list_display = ['survey', 'resident_id', 'submitted_at']
    search_fields = ['resident_id']
    list_filter = ['survey', 'submitted_at']


class AnswerAdmin(admin.ModelAdmin):
    list_display = ['response', 'question', 'choice']
    search_fields = ['response__resident_id']
    list_filter = ['response', 'question', 'choice']


class ReflectionFormAdmin(admin.ModelAdmin):
    list_display = ['resident', 'tittle', 'content', 'status']
    search_fields = ['tittle', 'content']
    list_filter = ['status']


class ManagerAdmin(admin.ModelAdmin):
    list_display = ['user_infor', 'area']
    search_fields = ['user_infor__first_name', 'user_infor__last_name']


class User_Admin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'role', 'username', 'created']
    search_fields = ['username', 'id']
    list_filter = ['id', 'sex']

    forms = UserForm

    def save_model(self, request, obj, form, change):
        # Kiểm tra xem có thay đổi mật khẩu không
        if 'password' in form.changed_data:
            # Băm mật khẩu mới trước khi lưu
            obj.password = make_password(form.cleaned_data['password'])
        obj.save()


admin_site.register(User, User_Admin)
admin_site.register(Resident, ResidentAdmin)
admin_site.register(MonthlyFee, MonthlyFeeAdmin)
admin_site.register(Manager,ManagerAdmin)
admin_site.register(Apartment,ApartmentAdmin)
admin_site.register(ReservationVehicle,ReservationVehicleAdmin)
admin_site.register(ResidentFee,ResidentFeeAdmin)
admin_site.register(ElectronicLockerItem,ElectronicLockerItemAdmin)
admin_site.register(Item,ItemAdmin)
admin_site.register(Survey,SurveyAdmin)
admin_site.register(Question,QuestionAdmin)
admin_site.register(Choice,ChoiceAdmin)
admin_site.register(Response,ResponseAdmin)
admin_site.register(ReflectionForm,ReflectionFormAdmin)
