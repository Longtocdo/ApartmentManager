from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apartment import serializers, paginators, perms
from apartment.models import ResidentFee, User, ElectronicLockerItem, Item, MonthlyFee, ReflectionForm, Resident, \
    Apartment, Survey, Answer, Vehicle, \
    ReservationVehicle


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

    # def get_permissions(self):
    #     if self.action in ['add_reflections']:
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny()]

    @action(methods=['get'], url_path='residentfees', detail=True)
    def get_residentfees(self, request, pk):
        residentfees = self.get_object().residentfee_set.filter(status=True)

        q = request.query_params.get('q')
        if q:
            residentfees = residentfees.filter(id=q)

        return Response(serializers.ResidentFeeSerializer(residentfees, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='reflection', detail=True)
    def get_reflection(self, request, pk):
        u = request.user
        return Response(serializers.ReflectionSerializer(u).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='reflections', detail=True)
    def add_reflection(self, request, pk):
        # r = self.get_object().reflection.create(tittle=request.data.get('tittle'),
        #                                             content=request.data.get('content'), user=request.user)
        resident = self.get_object()

        reflection = request.data

        reflection['resident'] = resident.user_infor

        serializer = serializers.ReflectionSerializer(data=reflection)

        # Validate và lưu appointment
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='reservation', detail=True)
    def sign_vehical(self, request, pk):
        rd = self.get_object()
        vehical = request.data
        vehical['resident'] = rd.user_infor
        serializer = serializers.VehicleSerializer(data=vehical)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
    def get_items(self, request):
        items = self.get_object().item_set.filter(status=True)

        q = request.query_params.get('q')
        if q:
            items = items.filter(name__icontains=q)

        return Response(serializers.ItemSerializer(items, many=True).data,
                        status=status.HTTP_200_OK)


class ApartmentViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ApartmentSerializer


class ItemViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ItemSerializer


class ReViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ReservationVehicle.objects.all()
    serializer_class = serializers.ReservationVehicleSerializer


# def get_queryset(self):
#     queryset = self.queryset
#
#     if self.action.__eq__('list'):
#         q = self.request.query_params.get('q')
#         if q:
#             queryset = queryset.filter(name__icontains=q)
#
#     return queryset

# class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Course.objects.filter(active=True)
#     serializer_class = serializers.CourseSerializer
#     pagination_class = paginators.CoursePaginator
#
#     def get_queryset(self):
#         queryset = self.queryset
#
#         if self.action.__eq__('list'):
#             q = self.request.query_params.get('q')
#             if q:
#                 queryset = queryset.filter(name__icontains=q)
#
#             cate_id = self.request.query_params.get('category_id')
#             if cate_id:
#                 queryset = queryset.filter(category_id=cate_id)
#
#         return queryset
#
#     @action(methods=['get'], url_path='lessons', detail=True)
#     def get_lessons(self, request, pk):
#         lessons = self.get_object().lesson_set.filter(active=True)
#
#         q = request.query_params.get('q')
#         if q:
#             lessons = lessons.filter(subject__icontains=q)
#
#         return Response(serializers.LessonSerializer(lessons, many=True).data,
#                         status=status.HTTP_200_OK)

#
# class LessonViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
#     queryset = Lesson.objects.prefetch_related('tags').filter(active=True)
#     serializer_class = serializers.LessonDetailsSerializer
#
#     def get_permissions(self):
#         if self.action in ['add_comment', 'like']:
#             return [permissions.IsAuthenticated()]
#
#         return [permissions.AllowAny()]
#
#     def get_serializer_class(self):
#         if self.request.user.is_authenticated:
#             return serializers.AuthenticatedLessonDetailsSerializer
#
#         return self.serializer_class
#
#     @action(methods=['get'], url_path='comments', detail=True)
#     def get_comments(self, request, pk):
#         comments = self.get_object().comment_set.select_related('user').order_by('-id')
#
#         paginator = paginators.CommentPaginator()
#         page = paginator.paginate_queryset(comments, request)
#         if page is not None:
#             serializer = serializers.CommentSerializer(page, many=True)
#             return paginator.get_paginated_response(serializer.data)
#
#         return Response(serializers.CommentSerializer(comments, many=True).data)
#
#     @action(methods=['post'], url_path='comments', detail=True)
#     def add_comment(self, request, pk):
#         c = self.get_object().comment_set.create(content=request.data.get('content'),
#                                                  user=request.user)
#         return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)
#
#     @action(methods=['post'], url_path='like', detail=True)
#     def like(self, request, pk):
#         li, created = Like.objects.get_or_create(lesson=self.get_object(),
#                                                  user=request.user)
#         if not created:
#             li.active = not li.active
#             li.save()
#
#         return Response(serializers.AuthenticatedLessonDetailsSerializer(self.get_object()).data)
#
#


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
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

# class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = serializers.CommentSerializer
#     permission_classes = [perms.CommentOwner]
#
