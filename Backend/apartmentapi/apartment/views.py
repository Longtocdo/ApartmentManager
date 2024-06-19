import string
import urllib
from rest_framework import viewsets, generics, parsers, permissions
from rest_framework.response import Response as ResponseRest
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.conf import settings
from apartment import serializers, paginators, perms
from django.core.mail import send_mail
from apartment.models import *
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.shortcuts import get_object_or_404
import cloudinary.uploader
from django.utils import timezone
import json
import hmac
import hashlib
import requests
import uuid
import random
from time import time
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import action
from apartment.models import ResidentFee

proxies = {
    'http': '',
    'https': ''
}


class ResidentFeeViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = ResidentFee.objects.all()
    serializer_class = serializers.ResidentFeeSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['get_queryset', 'update_paid']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(resident_id=q)

        return queryset

    @action(detail=True, methods=['patch'], url_path='upload_proof', url_name='upload_proof')
    def upload_proof(self, request, pk):
        # user_id = request.user.id
        fee_id = self.get_object()
        print(fee_id)
        avatar_file = request.data.get('', None)

        try:
            residentfee = get_object_or_404(ResidentFee, id=fee_id)
            new_avatar = cloudinary.uploader.upload(avatar_file)
            residentfee.payment_proof = new_avatar['secure_url']
            residentfee.status = residentfee.EnumStatusFee.DONE
            residentfee.save()
        except ResidentFee.DoesNotExist:
            return ResponseRest({'detail': 'Resident not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['patch'], detail=True, url_path='update-paid')
    def update_paid(self, request, pk=None):
        try:
            residentfee = self.get_object()
            residentfee.resident = request.user.resident
            residentfee.status = True
            residentfee.save()
            return ResponseRest({'message': 'Receipt paid successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return ResponseRest(dict(error=e.__str__()), status=status.HTTP_400_BAD_REQUEST)


class ResidentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentSerializer
    parser_classes = [parsers.MultiPartParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    # def get_permissions(self):
    #     if self.action in ['add_reflections', 'get_residentfees', 'upload_avatar', 'update_infor', 'get_reflection',
    #                        'register_vehicle']:
    #         return [permissions.IsAuthenticated()]
    #     return [permissions.AllowAny()]
    @action(methods=['get'], url_path='get_residentfees', detail=False)
    def get_residentfees(self, request):
        user_id = request.user.id
        bill_status = request.query_params.get('status')
        bill_type = request.query_params.get('type')
        bill_name = request.query_params.get('name')
        resident = get_object_or_404(Resident, user_info=user_id)
        residentfees = resident.resident_fees.all()

        if bill_status == "payed":
            residentfees = residentfees.filter(status=ResidentFee.EnumStatusFee.DONE)
        elif bill_status == "unpayed":
            residentfees = residentfees.filter(status=ResidentFee.EnumStatusFee.PENDING)
        elif bill_status == "deny":
            residentfees = residentfees.filter(status=ResidentFee.EnumStatusFee.DENY)

        if bill_type:
            residentfees = residentfees.filter(fee__types=bill_type)

        if bill_name:
            residentfees = residentfees.filter(fee__fee_name__icontains=bill_name)

        paginator = paginators.ServicePaginator()
        page = paginator.paginate_queryset(residentfees, request)
        if page is not None:
            serializer = serializers.ResidentFeeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return ResponseRest(serializers.ResidentFeeSerializer(residentfees, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='upload_avatar', url_name='upload_avatar')
    def upload_avatar(self, request, pk):
        # user_id = request.user.id
        user_id = self.get_object()
        print(user_id)
        avatar_file = request.data.get('avatar', None)

        try:
            resident = get_object_or_404(Resident, user_info_id=user_id)
            user = resident.user_info
            new_avatar = cloudinary.uploader.upload(avatar_file)
            user.avatar = new_avatar['secure_url']
            user.save()
        except Resident.DoesNotExist:
            return ResponseRest({'detail': 'Resident not found'}, status=status.HTTP_404_NOT_FOUND)

        return ResponseRest(serializers.ResidentSerializer(resident).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update_infor', detail=True)
    def update_infor(self, request, pk=None):
        user_id = self.get_object()
        try:
            resident = get_object_or_404(Resident, user_info_id=user_id)
            user = resident.user_info  # Get the User object associated with the Resident
            for k, v in request.data.items():
                if k == 'id' or k == 'username':
                    continue
                setattr(user, k, v)
            user.save()  # Save the User object
        except Resident.DoesNotExist:
            return ResponseRest({'detail': 'Resident not found'}, status=status.HTTP_404_NOT_FOUND)
        return ResponseRest(serializers.ResidentSerializer(resident).data)  # Return the serialized Resident object

    @action(methods=['post'], url_path='pay_service', detail=True)
    def add_residentfee(self, request, pk=None):
        resident = self.get_object()
        residentfee_data = request.data.copy()
        residentfee_data['resident'] = resident.user_info
        fee_id = residentfee_data.get('fee_id')
        if fee_id:
            try:
                service = Service.objects.get(id=fee_id)
                residentfee_data['fee'] = service  # Set the Service object directly
            except Service.DoesNotExist:
                return ResponseRest({'error': 'Invalid fee_id'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return ResponseRest({'error': 'fee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.ResidentFeeSerializer(data=residentfee_data)
        if serializer.is_valid():
            serializer.save()
            return ResponseRest(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return ResponseRest(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_report(self, request, pk=None):
        resident = self.get_object()
        reflection = Report.objects.filter(resident=resident).first()
        if reflection:
            serializer = serializers.ReportSerializer(reflection)
            return ResponseRest(serializer.data, status=status.HTTP_200_OK)
        else:
            return ResponseRest({'message': 'No reflection found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='report', detail=False)
    def add_report(self, request):
        # Lấy thông tin người dùng đã xác thực
        user = request.user
        # Tạo một báo cáo mới
        report_data = {
            'resident': Resident.objects.get(user_info=user),  # Giả sử người dùng có hồ sơ Resident liên quan
            'title': request.data.get('title'),
            'content': request.data.get('content'),
        }

        serializer = serializers.ReportSerializer(data=report_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseRest(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def register_vehicle(self, request, pk=None):
        resident = self.get_object()
        serializer = serializers.ReservationVehicleSerializer(data=request.data)

        if serializer.is_valid():
            vehicle_data = serializer.validated_data
            vehicle_data['price'] = 50000  # Set the price directly
            vehicle_data['types'] = Service.EnumServiceType.Svc3
            vehicle_data['resident'] = resident
            vehicle = ReservationVehicle.objects.create(**vehicle_data)
            return ResponseRest(serializers.ReservationVehicleSerializer(vehicle).data, status=status.HTTP_201_CREATED)
        else:
            return ResponseRest(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='answer', detail=True)
    def add_answer(self, request, pk=None):
        resident = self.get_object()
        serializer = serializers.AnswerSerializer(data=request.data)
        if serializer.is_valid():
            answer_data = serializer.validated_data
            answer_data['resident'] = resident
            answer = Answer.objects.create(**answer_data)
            return ResponseRest(serializers.AnswerSerializer(answer).data, status=status.HTTP_200_OK)
        else:
            return ResponseRest(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='response', detail=True)
    def add_response(self, request, pk):
        resident = self.get_object()
        response_data = request.data.copy()
        response_data['resident'] = resident.user_info  # Sử dụng ID của resident

        serializer = serializers.ResponseSerializer(data=response_data)

        # Validate và lưu reflection
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseRest(serializer.data, status=status.HTTP_201_CREATED)


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView,
                    generics.CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = serializers.ReportSerializer
    permission_classes = [perms.ReportOwner]


class ElectronicLockerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ElectronicLockerItem.objects.all()
    serializer_class = serializers.ElectronicLockerItemSerializer

    def get_permissions(self):
        if self.action in ['get_items', 'mark_as_received']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='items', detail=False)
    def get_items(self, request):
        user_id = request.user.id
        resident = get_object_or_404(Resident, user_info_id=user_id)
        electronic_locker, created = ElectronicLockerItem.objects.get_or_create(apartment=resident.apartment)

        items = electronic_locker.items.all()

        stt = request.query_params.get('status')
        if stt == 'received':
            items = items.filter(status=True)
        elif stt == 'pending':
            items = items.filter(status=False)
        else:
            return ResponseRest({'detail': 'Invalid status parameter. Use "received" or "pending".'},
                                status=status.HTTP_400_BAD_REQUEST)

        q = request.query_params.get('q')
        if q:
            items = items.filter(item_name__icontains=q)

        return ResponseRest(serializers.ItemSerializer(items, many=True).data,
                            status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def mark_as_received(self, request, pk=None):
        try:
            electronic_locker = self.get_object()
            item_id = request.data.get('item_id')
            print(item_id)
            if not item_id:
                return ResponseRest({'detail': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

            item = Item.objects.get(pk=item_id, electronic_lock=electronic_locker)
            if item.status == 0:
                item.status = 1
                item.save()

                # Gửi email thông báo cho cư dân
                subject = 'Notification: Your item is ready for pickup'
                message = f'Hello {item.electronic_lock.apartment.resident.user_info.first_name},\n\n'
                message += f'Your item "{item.item_name}" is now available for pickup.\n\n'
                message += 'Please come to the front desk to collect it.\n\n'
                message += 'Best regards,\nThe Management Team'
                recipient_email = item.electronic_lock.apartment.resident.user_info.email

                send_mail(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [recipient_email],
                    fail_silently=False,
                )

                return ResponseRest({'detail': 'Item marked as received successfully and notification email sent.'},
                                    status=status.HTTP_200_OK)
            else:
                return ResponseRest({'detail': 'Item is not in pending state.'}, status=status.HTTP_400_BAD_REQUEST)
        except Item.DoesNotExist:
            return ResponseRest({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return ResponseRest({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='add_item', detail=True)
    def add_item(self, request, pk=None):
        try:
            electronic_locker = self.get_object()
            item_name = request.data.get('item_name')
            if not item_name:
                return ResponseRest({'detail': 'Item name is required.'}, status=status.HTTP_400_BAD_REQUEST)

            new_item = Item.objects.create(
                item_name=item_name,
                electronic_lock=electronic_locker
            )

            subject = 'Notification: New item added to your electronic locker'
            message = f'Hello {new_item.electronic_lock.apartment.resident.user_info.first_name},\n\n'
            message += f'A new item "{new_item.item_name}" has been added to your electronic locker.\n\n'
            message += 'Please check your locker for the new item.\n\n'
            message += 'Best regards,\nThe Management Team'
            recipient_email = new_item.electronic_lock.apartment.resident.user_info.email

            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [recipient_email],
                fail_silently=False,
            )

            return ResponseRest({'detail': 'New item added successfully and notification email sent.'},
                                status=status.HTTP_201_CREATED)
        except Exception as e:
            return ResponseRest({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ApartmentViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = serializers.ApartmentSerializer
    permission_classes = [permissions.AllowAny]


class ItemViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(item_name__icontains=q)
        return queryset

    @action(methods=['get'], detail=False)
    def get_items(self, request):

        stt = request.query_params.get('status')
        if stt == 'received':
            items = self.queryset.filter(status=True)
        elif stt == 'pending':
            items = self.queryset.filter(status=False)
        else:
            return ResponseRest({'detail': 'Invalid status parameter. Use "received" or "pending".'},
                                status=status.HTTP_400_BAD_REQUEST)

        return ResponseRest(serializers.ItemSerializer(items, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], detail=True)
    def received_item(self, request, pk=None):
        try:
            item = Item.objects.get(pk=pk)  # Retrieve the item from the database
        except Item.DoesNotExist:
            return ResponseRest({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        if item.status:
            return ResponseRest({'detail': 'Item is already received.'}, status=status.HTTP_400_BAD_REQUEST)

        item.status = True
        item.received_date = timezone.now()  # Set the received date
        item.save()

        return ResponseRest(serializers.ItemSerializer(item).data, status=status.HTTP_200_OK)


class ReservationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ReservationVehicle.objects.all()
    serializer_class = serializers.ReservationVehicleSerializer


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Survey.objects.all()
    serializer_class = serializers.SurveySerializer
    permission_classes = [permissions.AllowAny]
    action(detail=False, methods=['get'])

    @action(detail=False, methods=['get'], url_path='pending')
    def pending_surveys(self, request):
        user = request.user
        resident = Resident.objects.get(user_info=user)
        completed_surveys = Survey.objects.filter(response__resident=resident)
        pending_surveys = Survey.objects.exclude(pk__in=completed_surveys)
        serializer = self.get_serializer(pending_surveys, many=True)
        return ResponseRest(serializer.data)

    @action(detail=False, methods=['get'], url_path='completed')
    def completed_surveys(self, request):
        user = request.user
        resident = Resident.objects.get(user_info=user)
        completed = Survey.objects.filter(response__resident=resident)
        serializer = self.get_serializer(completed, many=True)
        return ResponseRest(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='response')
    def submit_response(self, request, pk=None):
        survey = get_object_or_404(Survey, pk=pk)
        resident = get_object_or_404(Resident, user_info=request.user)

        data = request.data.copy()
        data['survey'] = survey.id
        data['resident'] = resident.user_info

        print(data)
        serializer = serializers.ResponseSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return ResponseRest(serializer.data, status=status.HTTP_201_CREATED)

        return ResponseRest(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = serializers.QuestionSerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, PermissionRequiredMixin):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, JSONParser]

    def get_permissions(self):
        if self.action in ['get_current_user', 'register_user']:
            return [perms.AdminOwner()]

        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], url_path='register_user', url_name='register_user')
    def register_user(self, request):
        try:
            data = request.data
            avatar = data.get("avatar")
            new_avatar = cloudinary.uploader.upload(avatar)

            new_user = User.objects.create_user(
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                username=data.get("username"),
                email=data.get("email"),
                password=make_password(data.get("password")),
                avatar=new_avatar['secure_url'],
                phone=data.get("phone"),
                sex=data.get("sex", User.EnumSex.MALE),
                role=data.get("role", User.EnumRole.RESIDENT)
            )

            if new_user.role == User.EnumRole.RESIDENT:
                Resident.objects.create(user_info=new_user)

            return ResponseRest(data=serializers.UserSerializer(new_user, context={'request': request}).data,
                                status=status.HTTP_201_CREATED)
        except Exception as e:
            return ResponseRest(dict(error=str(e)), status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['patch'], url_path='update_password', url_name='change_password')
    def update_password(self, request):
        user = get_object_or_404(User, id=request.user.id)
        old_password = request.data.get('old_password', None)
        new_password = request.data.get('new_password', None)
        print(user)
        if not old_password or not new_password:
            return ResponseRest({'detail': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        if user.check_password(old_password):
            user.set_password(new_password)
            user.is_first_login = False
            user.save()
            return ResponseRest({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return ResponseRest({'detail': 'Invalid old password'}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return ResponseRest(serializers.UserSerializer(user).data)

    @action(detail=False, methods=['post'], url_path='forgot_password', url_name='forgot_password')
    def forgot_password(self, request):
        email = request.data.get('email', None)
        if not email:
            return ResponseRest({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return ResponseRest({'detail': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        user.password = make_password(new_password)
        user.save()

        send_mail(
            'New Password',
            f'Your new password is: {new_password}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return ResponseRest({'detail': 'New password has been sent to your email address.'}, status=status.HTTP_200_OK)


class AnswerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Answer.objects.all()
    serializer_class = serializers.AnswerSerializer


class ResponseViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Response.objects.all()
    serializer_class = serializers.ResponseSerializer


class PostViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    pagination_class = paginators.PostPaginator


class MomoViewSet(viewsets.ViewSet):
    serializer_class = serializers.ResidentFeeSerializer

    @action(detail=False, methods=['post'], url_path='process_payment', url_name='process_payment')
    @csrf_exempt
    def process_payment(self, request):
        if request.method == 'POST':
            try:
                payment_data = request.data
                amount = payment_data.get('price')
                resident_fee_id = payment_data.get('resident_fee_id')
                amount = int(amount)
                try:
                    resident_fee = ResidentFee.objects.get(id=resident_fee_id)
                except ResidentFee.DoesNotExist:
                    return JsonResponse({'error': 'ResidentFee not found'}, status=404)

                expected_amount = resident_fee.fee.price
                print(amount)
                print(expected_amount)
                if amount != expected_amount:
                    return JsonResponse({'error': 'Amount does not match'}, status=400)

                order_id = str(uuid.uuid4())
                request_id = str(uuid.uuid4())

                endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
                access_key = "F8BBA842ECF85"
                secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
                order_info = str(resident_fee_id)
                redirect_url = "https://longtocdo107.pythonanywhere.com/"
                ipn_url = "http://192.168.1.84:8000/momo/momo_ipn/"

                raw_signature = f"accessKey={access_key}&amount={amount}&extraData=&ipnUrl={ipn_url}&orderId={order_id}&orderInfo={order_info}&partnerCode=MOMO&redirectUrl={redirect_url}&requestId={request_id}&requestType=captureWallet"
                h = hmac.new(bytes(secret_key, 'ascii'), bytes(raw_signature, 'ascii'), hashlib.sha256)
                signature = h.hexdigest()

                data = {
                    'partnerCode': 'MOMO',
                    'partnerName': 'Test',
                    'storeId': 'MomoTestStore',
                    'requestId': request_id,
                    'amount': str(amount),
                    'orderId': order_id,
                    'orderInfo': order_info,
                    'redirectUrl': redirect_url,
                    'ipnUrl': ipn_url,
                    'lang': 'vi',
                    'extraData': '',
                    'requestType': 'captureWallet',
                    'signature': signature
                }

                response = requests.post(endpoint, json=data, proxies=None)

                if response.status_code == 200:
                    response_data = response.json()
                    if 'payUrl' in response_data:
                        return JsonResponse({'payUrl': response_data['payUrl']})
                    else:
                        return JsonResponse({'error': 'Failed to process payment'}, status=400)
                else:
                    return JsonResponse({'error': 'Failed to communicate with MoMo'}, status=500)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

    @action(detail=False, methods=['post'], url_path='momo_ipn')
    @csrf_exempt
    def momo_ipn(self, request):
        if request.method == 'POST':
            try:
                ipn_data = request.data  # Sử dụng request.data thay vì json.loads(request.data)
                order_info = ipn_data.get('orderInfo')
                result_code = ipn_data.get('resultCode')

                if result_code == 0:
                    try:
                        resident_fee = ResidentFee.objects.get(id=order_info)
                        resident_fee.status = resident_fee.EnumStatusFee.DONE
                        resident_fee.save()
                        return JsonResponse({'message': 'Payment successful and status updated'}, status=200)
                    except ResidentFee.DoesNotExist:
                        return JsonResponse({'error': 'ResidentFee not found'}, status=409)
                else:
                    return JsonResponse({'error': 'Payment failed'}, status=400)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)


# ZALOPAY

config = {
    "appid": 2553,
    "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    "endpoint": "https://sb-openapi.zalopay.vn/v2/create"
}


class ZaloViewSet(viewsets.ViewSet):

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='create', url_name='create_zalo')
    def create_zalo_payment(self, request):
        try:
            resident_fee_id = request.data.get('resident_fee_id')
            try:
                resident_fee = ResidentFee.objects.get(id=resident_fee_id)
            except ResidentFee.DoesNotExist:
                return JsonResponse({'error': 'ResidentFee not found'}, status=404)

            amount = resident_fee.fee.price
            transID = random.randrange(1000000)
            order = {
                "app_id": config["appid"],
                "app_trans_id": "{:%y%m%d}_{}".format(datetime.today(), transID),
                "app_user": "demo",
                "app_time": int(round(time() * 1000)),
                "embed_data": json.dumps({
                    "merchantinfo": "embeddata123"
                }),
                "item": json.dumps([{
                    "itemid": str(resident_fee.id),
                    "itemname": resident_fee.fee.fee_name,
                    "itemprice": resident_fee.fee.price,
                    "itemquantity": 1
                }]),
                "amount": amount,
                "description": "Thanh toán phí cư dân",
                "bank_code": "zalopayapp"
            }

            data = "{}|{}|{}|{}|{}|{}|{}".format(order["app_id"], order["app_trans_id"], order["app_user"],
                                                 order["amount"], order["app_time"], order["embed_data"], order["item"])

            order["mac"] = hmac.new(config['key1'].encode(), data.encode(), hashlib.sha256).hexdigest()

            response = urllib.request.urlopen(url=config["endpoint"],
                                              data=urllib.parse.urlencode(order).encode())
            result = json.loads(response.read())

            if result['return_code'] == 1:
                resident_fee.status = True
                resident_fee.save()
                return JsonResponse({**result, 'app_trans_id': order['app_trans_id']})
            else:
                error_message = result.get('returnmessage', 'Failed to create order')
                return JsonResponse({'error': error_message}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='callback', url_name='create_zalo')
    def callback(self, request):
        config = {
            'key2': 'eG4r0GcoNtRGbO8'
        }

        result = {}

        try:
            cbdata = request.data
            mac = hmac.new(config['key2'].encode(), cbdata['data'].encode(), hashlib.sha256).hexdigest()

            if mac != cbdata['mac']:
                result['return_code'] = -1
                result['return_message'] = 'mac not equal'
            else:
                dataJson = json.loads(cbdata['data'])
                print("update order's status = success where app_trans_id = " + dataJson['app_trans_id'])

                result['return_code'] = 1
                result['return_message'] = 'success'
        except Exception as e:
            result['return_code'] = 0
            result[' e'] = str(e)

        return JsonResponse(result)
