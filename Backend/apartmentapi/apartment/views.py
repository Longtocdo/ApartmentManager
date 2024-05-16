from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apartment import serializers, paginators, perms
from apartment.models import ResidentFee, User, ElectronicLockerItem, Item, MonthlyFee, ReflectionForm, Resident, \
    Apartment, Survey, Answer, \
    ReservationVehicle
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.shortcuts import get_object_or_404


class ResidentFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ResidentFee.objects.filter(status=True)
    serializer_class = serializers.ResidentFeeSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(resident_id=q)
        return queryset


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
            serializer = serializers.ReflectionSerializer(reflection)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No reflection found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='reflections', detail=True)
    def add_reflection(self, request, pk):
        resident = self.get_object()

        reflection = request.data

        reflection['resident'] = resident.user_infor

        serializer = serializers.ReflectionSerializer(data=reflection)

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
    # @action(methods=['post'], url_path='reservation', detail=True)
    # def sign_vehicle(self, request, pk):
    #     resident = self.get_object()
    #
    #     # Sử dụng serializer để xác thực dữ liệu
    #     serializer = serializers.ReservationVehicleSerializer(data=request.data)
    #
    #     if serializer.is_valid():
    #         # Lấy dữ liệu đã xác thực từ serializer
    #         vehicle_data = serializer.validated_data
    #
    #         # Thêm thông tin của cư dân vào dữ liệu của phương tiện
    #         vehicle_data['resident'] = resident.user_infor
    #
    #         # Lưu dữ liệu vào cơ sở dữ liệu
    #         vehicle = ReservationVehicle.objects.create(**vehicle_data)
    #
    #         return Response(serializers.ReservationVehicleSerializer(vehicle).data, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthlyFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MonthlyFee.objects.all()
    serializer_class = serializers.MonthlyFeeSerializer


class ReflectionViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.DestroyAPIView, generics.UpdateAPIView,
                        generics.CreateAPIView):
    queryset = ReflectionForm.objects.all()
    serializer_class = serializers.ReflectionSerializer


class ElectronicLockerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ElectronicLockerItem.objects.filter(status=True)
    serializer_class = serializers.ElectronicLockerSerializer

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
