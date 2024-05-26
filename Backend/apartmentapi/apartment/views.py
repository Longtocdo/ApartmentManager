import string
import urllib
from django.contrib.auth import authenticate, login
from rest_framework import viewsets, generics, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response as ResponseRest
from rest_framework import status
from django.conf import settings
from apartment import serializers, paginators, perms
from django.core.mail import send_mail
from apartment.models import *
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.shortcuts import get_object_or_404


class ResidentFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ResidentFee.objects.filter(status=True)
    serializer_class = serializers.ResidentFeeSerializer

    # def get_permissions(self):
    #     if self.action in ['update_paid']:
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(resident_id=q)
        return queryset

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

    # def get_permissions(self):
    #     if self.action in ['add_reflections', 'get_residentfees']:
    #         return [permissions.IsAuthenticated()]
    #     return [permissions.AllowAny()]

    @action(methods=['get'], url_path='residentfees', detail=False)
    def get_residentfees(self, request):
        user_id = request.user.id
        resident = get_object_or_404(Resident, user_infor=user_id)
        residentfees = resident.residentfee_set.filter(status=True)
        q = request.query_params.get('q')
        if q:
            residentfees = residentfees.filter(id=q)
        return ResponseRest(serializers.ResidentFeeSerializer(residentfees, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='residentfeess', detail=True)
    def add_residentfeess(self, request, pk=None):
        resident = self.get_object()
        residentfee_data = request.data.copy()
        residentfee_data['resident'] = resident.user_info  # Sử dụng ID của resident
        serializer = serializers.ResidentFeeSerializer(data=residentfee_data)
        # Validate và lưu resident fee
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseRest(serializer.data)

    @action(detail=True, methods=['get'])
    def get_reflection(self, request, pk=None):
        resident = self.get_object()
        reflection = ReflectionForm.objects.filter(resident=resident).first()
        if reflection:
            serializer = serializers.ReflectionFormSerializer(reflection)
            return ResponseRest(serializer.data, status=status.HTTP_200_OK)
        else:
            return ResponseRest({'message': 'No reflection found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='reflections', detail=True)
    def add_reflection(self, request, pk):
        resident = self.get_object()
        reflection_data = request.data.copy()
        reflection_data['resident'] = resident.user_info  # Sử dụng ID của resident

        serializer = serializers.ReflectionFormSerializer(data=reflection_data)

        # Validate và lưu reflection
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return ResponseRest(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def register_vehicle(self, request, pk=None):
        resident = self.get_object()
        serializer = serializers.ReservationVehicleSerializer(data=request.data)

        if serializer.is_valid():
            vehicle_data = serializer.validated_data
            vehicle_data['resident'] = resident
            vehicle = ReservationVehicle.objects.create(**vehicle_data)
            return ResponseRest(serializers.ReservationVehicleSerializer(vehicle).data, status=status.HTTP_201_CREATED)
        else:
            return ResponseRest(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthlyFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MonthlyFee.objects.all()
    serializer_class = serializers.MonthlyFeeSerializer


class ReflectionViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView,
                        generics.CreateAPIView):
    queryset = ReflectionForm.objects.all()
    serializer_class = serializers.ReflectionFormSerializer
    permission_classes = [perms.ReflectionOwner]


class ElectronicLockerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ElectronicLockerItem.objects.filter(status=True)
    serializer_class = serializers.ElectronicLockerItemSerializer

    #     course
    @action(methods=['get'], url_path='items', detail=True)
    def get_items(self, request, pk):
        items = self.get_object().item_set.filter(status=True)

        q = request.query_params.get('q')
        if q:
            items = items.filter(name__icontains=q)

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


class ApartmentViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = serializers.ApartmentSerializer


class ItemViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ItemSerializer


class ReservationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ReservationVehicle.objects.all()
    serializer_class = serializers.ReservationVehicleSerializer


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, PermissionRequiredMixin):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    # def get_permissions(self):
    #     #     if self.action in ['get_current_user']:
    #     #         return [permissions.IsAuthenticated()]
    #     #
    #     #     return [permissions.AllowAny()]
    # @action(detail=False, methods=['post'], url_path='login', url_name='login')
    # def login_user(self, request):
    #     username = request.data.get('username')
    #     password = request.data.get('password')
    #
    #     if not username or not password:
    #         return ResponseRest({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    #
    #     user = authenticate(username=username, password=password)
    #
    #     if user is not None:
    #         login(request, user)
    #         serializer = serializers.UserSerializer(user, context={'request': request})
    #         return ResponseRest(serializer.data, status=status.HTTP_200_OK)
    #     else:
    #         return ResponseRest({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

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
        user_id = request.data.get('id', None)
        old_password = request.data.get('old_password', None)
        new_password = request.data.get('new_password', None)

        if not user_id or not old_password or not new_password:
            return ResponseRest({'detail': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return ResponseRest({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.change_password_required:
            if user.check_password(old_password):
                user.set_password(new_password)
                user.change_password_required = False
                user.save()
                return ResponseRest({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)
            else:
                return ResponseRest({'detail': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return ResponseRest({'detail': 'Password change not required'}, status=status.HTTP_400_BAD_REQUEST)
        # Hàm upload avatar

    @action(detail=True, methods=['post'], url_path='upload_avatar', url_name='upload_avatar')
    def upload_avatar(self, request, pk=None):
        user_id = request.data.get('id', None)
        avatar_file = request.data.get('avatar')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return ResponseRest({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        new_avatar = cloudinary.uploader.upload(avatar_file)
        user.avatar = new_avatar['secure_url']
        user.save()
        return ResponseRest({'detail': 'Avatar uploaded successfully'}, status=status.HTTP_200_OK)

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

        # Tạo một mật khẩu mới ngẫu nhiên
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        # Mã hóa mật khẩu mới
        user.password = make_password(new_password)
        user.save()

        # Gửi mật khẩu mới qua email
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


import hmac
import hashlib
import json
import requests
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from apartment.models import ResidentFee


# MOMO
@csrf_exempt
def process_payment(request):
    if request.method == 'POST':
        try:
            payment_data = json.loads(request.body)
            amount = payment_data.get('price')
            resident_fee_id = payment_data.get('resident_fee_id')

            try:
                resident_fee = ResidentFee.objects.get(id=resident_fee_id)
            except ResidentFee.DoesNotExist:
                return JsonResponse({'error': 'ResidentFee not found'}, status=404)

            expected_amount = resident_fee.fee.price
            if amount != expected_amount:
                return JsonResponse({'error': 'Amount does not match'}, status=400)

            order_id = str(uuid.uuid4())
            request_id = str(uuid.uuid4())

            endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
            access_key = "F8BBA842ECF85"
            secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
            order_info = str(resident_fee_id)
            redirect_url = "http://127.0.0.1:8000/"
            ipn_url = "https://msang2003.pythonanywhere.com/api/momo_ipn/"

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


@csrf_exempt
def momo_ipn(request):
    if request.method == 'POST':
        try:
            ipn_data = json.loads(request.body)
            order_info = ipn_data.get('orderInfo')
            result_code = ipn_data.get('resultCode')

            if result_code == 0:
                try:
                    resident_fee = ResidentFee.objects.get(id=order_info)
                    resident_fee.status = True
                    resident_fee.save()
                    return JsonResponse({'message': 'Payment successful and status updated'}, status=200)
                except ResidentFee.DoesNotExist:
                    return JsonResponse({'error': 'ResidentFee not found'}, status=404)
            else:
                return JsonResponse({'error': 'Payment failed'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


# import hmac
# import hashlib
# ZALOPAY

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

config = {
    "appid": 2553,
    "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    "endpoint": "https://sb-openapi.zalopay.vn/v2/create"
}


class ZaloViewSet(viewsets.ViewSet):
    # permission_classes = [perms.IsNurse]

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='create', url_name='create_zalo')
    def create_zalo_payment(self, request):
        try:
            resident_fee_id = request.data.get('resident_fee_id')

            # Lấy thông tin ResidentFee từ cơ sở dữ liệu
            try:
                resident_fee = ResidentFee.objects.get(id=resident_fee_id)
            except ResidentFee.DoesNotExist:
                return JsonResponse({'error': 'ResidentFee not found'}, status=404)

            amount = resident_fee.fee.price
            transID = random.randrange(1000000)
            # Cấu hình thông tin đơn hàng
            order = {
                "app_id": config["appid"],
                "app_trans_id": "{:%y%m%d}_{}".format(datetime.today(), transID),
                # mã giao dịch có định dạng yyMMdd_xxxx
                "app_user": "demo",
                "app_time": int(round(time() * 1000)),  # milliseconds
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

            # Tạo chuỗi dữ liệu theo định dạng yêu cầu
            data = "{}|{}|{}|{}|{}|{}|{}".format(order["app_id"], order["app_trans_id"], order["app_user"],
                                                 order["amount"], order["app_time"], order["embed_data"], order["item"])

            # Tính toán MAC bằng cách sử dụng HMAC
            order["mac"] = hmac.new(config['key1'].encode(), data.encode(), hashlib.sha256).hexdigest()

            response = urllib.request.urlopen(url=config["endpoint"],
                                              data=urllib.parse.urlencode(order).encode())
            result = json.loads(response.read())

            # Trả về kết quả từ API
            if result['return_code'] == 1:
                resident_fee.status = True
                resident_fee.save()
                return JsonResponse({**result, 'app_trans_id': order['app_trans_id']})
            else:
                error_message = result.get('returnmessage', 'Failed to create order')
                return JsonResponse({'error': error_message}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        # coding=utf-8
        # Python 3.6

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

            # kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if mac != cbdata['mac']:
                # callback không hợp lệ
                result['return_code'] = -1
                result['return_message'] = 'mac not equal'
            else:
                # thanh toán thành công
                # merchant cập nhật trạng thái cho đơn hàng
                dataJson = json.loads(cbdata['data'])
                print("update order's status = success where app_trans_id = " + dataJson['app_trans_id'])

                result['return_code'] = 1
                result['return_message'] = 'success'
        except Exception as e:
            result['return_code'] = 0  # ZaloPay server sẽ callback lại (tối đa 3 lần)
            result[' e'] = str(e)

        # thông báo kết quả cho ZaloPay server
        return JsonResponse(result)
