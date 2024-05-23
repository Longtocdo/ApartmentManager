from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
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
            return Response({'message': 'Receipt paid successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(dict(error=e.__str__()), status=status.HTTP_400_BAD_REQUEST)


class ResidentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentSerializer

    def get_permissions(self):
        if self.action in ['add_reflections', 'get_residentfees']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='residentfees', detail=False)
    def get_residentfees(self, request):
        user_id = request.user.id

        resident = get_object_or_404(Resident, user_infor=user_id)

        residentfees = resident.residentfee_set.filter(status=True)
        q = request.query_params.get('q')
        if q:
            residentfees = residentfees.filter(id=q)

        return Response(serializers.ResidentFeeSerializer(residentfees, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_reflection(self, request, pk=None):
        resident = self.get_object()
        reflection = ReflectionForm.objects.filter(resident=resident).first()
        if reflection:
            serializer = serializers.ReflectionFormSerializer(reflection)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No reflection found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='reflections', detail=True)
    def add_reflection(self, request, pk):
        resident = self.get_object()

        reflection = request.data

        reflection['resident'] = resident.user_infor

        serializer = serializers.ReflectionFormSerializer(data=reflection)

        # Validate và lưu appointment
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def register_vehicle(self, request, pk=None):
        resident = self.get_object()
        serializer = serializers.ReservationVehicleSerializer(data=request.data)

        if serializer.is_valid():
            # Lấy dữ liệu đã xác thực từ serializer
            vehicle_data = serializer.validated_data

            # Thêm thông tin của cư dân vào dữ liệu của phương tiện
            vehicle_data['resident'] = resident

            # Lưu dữ liệu vào cơ sở dữ liệu
            vehicle = ReservationVehicle.objects.create(**vehicle_data)

            return Response(serializers.ReservationVehicleSerializer(vehicle).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        return Response(serializers.ItemSerializer(items, many=True).data,
                        status=status.HTTP_200_OK)


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

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)


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
            # Nhận thông tin thanh toán từ yêu cầu POST
            payment_data = json.loads(request.body)
            amount = payment_data.get('price')
            resident_fee_id = payment_data.get('resident_fee_id')  # Lấy resident_fee_id từ yêu cầu POST

            # Kiểm tra xem resident_fee_id có tồn tại hay không
            try:
                resident_fee = ResidentFee.objects.get(id=resident_fee_id)
            except ResidentFee.DoesNotExist:
                return JsonResponse({'error': 'ResidentFee not found'}, status=404)

            # Lấy số tiền từ ResidentFee (kế thừa từ MonthlyFee)
            expected_amount = resident_fee.fee.price

            # Kiểm tra số tiền có khớp nhau hay không
            if amount != expected_amount:
                return JsonResponse({'error': 'Amount does not match'}, status=400)

            # Tạo orderId và requestId
            order_id = str(uuid.uuid4())
            request_id = str(uuid.uuid4())

            # Cấu hình thông tin MoMo
            endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
            access_key = "F8BBA842ECF85"
            secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
            order_info = str(resident_fee_id)
            redirect_url = "http://127.0.0.1:8000/"  # Thay đổi URL redirect tại đây
            ipn_url = "http://127.0.0.1:8000/api/momo_ipn/"  # Thay đổi URL IPN tại đây

            # Tạo chuỗi chữ ký
            raw_signature = "accessKey=" + access_key + "&amount=" + str(amount) + "&extraData=" + "" \
                            + "&ipnUrl=" + ipn_url + "&orderId=" + order_id + "&orderInfo=" + order_info \
                            + "&partnerCode=MOMO" + "&redirectUrl=" + redirect_url + "&requestId=" + request_id \
                            + "&requestType=captureWallet"
            h = hmac.new(bytes(secret_key, 'ascii'), bytes(raw_signature, 'ascii'), hashlib.sha256)
            signature = h.hexdigest()

            # Tạo dữ liệu gửi đến MoMo
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

            # Gửi yêu cầu thanh toán đến MoMo
            response = requests.post(endpoint, json=data)

            # Xử lý kết quả trả về từ MoMo
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

            print(order_info)
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
