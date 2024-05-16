from rest_framework import serializers
from apartment.models import ResidentFee, MonthlyFee, Resident, ElectronicLockerItem, Item, Apartment, ReflectionForm, \
    Survey, Answer, ReservationVehicle, \
    Response, User, Question
from django.contrib.auth.hashers import make_password


class ResidentFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidentFee
        fields = ['resident', 'fee', 'amount', 'payment_date', 'payment_method']


class MonthlyFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyFee
        fields = '__all__'


class ResidentSerializer(serializers.ModelSerializer):
    monthly_fees = MonthlyFeeSerializer(many=True, read_only=True)

    class Meta:
        model = Resident
        fields = ['user_infor', 'monthly_fees']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'


class ElectronicLockerSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer()

    class Meta:
        model = ElectronicLockerItem
        fields = ['name', 'status', 'apartment']


#
# class LessonDetailsSerializer(LessonSerializer):
#     tags = TagSerializer(many=True)
#
#     class Meta:
#         model = LessonSerializer.Meta.model
#         fields = LessonSerializer.Meta.fields + ['content', 'tags']
#
#
# class AuthenticatedLessonDetailsSerializer(LessonDetailsSerializer):
#     liked = serializers.SerializerMethodField()
#
#     def get_liked(self, lesson):
#         return lesson.like_set.filter(active=True).exists()
#
#     class Meta:
#         model = LessonDetailsSerializer.Meta.model
#         fields = LessonDetailsSerializer.Meta.fields + ['liked']
#
#
class UserSerializer(serializers.ModelSerializer):
    # def create(self, validated_data):
    #     password = validated_data.pop('password')
    #     user = User.objects.create(**validated_data)
    #     user.set_password(password)  # Băm mật khẩu trước khi lưu
    #     user.save()
    #     return user
    def create(self, validated_data):
        # Kiểm tra xem có phải là superuser không
        is_superuser = validated_data.pop('is_superuser', False)

        # Băm mật khẩu trước khi tạo người dùng
        if not is_superuser:
            password = validated_data.pop('password', None)
            user = User.objects.create(**validated_data)
            if password:
                user.set_password(password)
                user.save()
                print("Mật khẩu đã được băm:", user.password)
        else:
            user = User.objects.create_superuser(**validated_data)

        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ReservationVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationVehicle
        fields = '__all__'
        # fields = '__all__'


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReflectionForm
        fields = '__all__'
#
# class CommentSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#
#     class Meta:
#         model = Comment
#         fields = ['id', 'content', 'created_date', 'user']
