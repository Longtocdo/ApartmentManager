from rest_framework import serializers
from apartment.models import ResidentFee, MonthlyFee, Resident, ElectronicLockerItem, Item, Apartment, ReflectionForm, \
    Survey, Answer, Vehicle, ReservationVehicle,Response, User, Question


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
        fields = ['user_infor', 'apartment', 'monthly_fees']


class ElectronicLockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectronicLockerItem
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'


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

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class ReservationVehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReservationVehicle
        fields = ['resident_reservation', 'reservation_vehicles', 'reservation_name', 'vehicle_number']
        # fields = '__all__'


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReflectionForm
        fields = ['resident', 'tittle', 'content']
#
#
# class CommentSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#
#     class Meta:
#         model = Comment
#         fields = ['id', 'content', 'created_date', 'user']
