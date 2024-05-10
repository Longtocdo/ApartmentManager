from rest_framework import serializers
from apartment.models import ResidentFee, MonthlyFee, Resident, ElectronicLockerItem, Item, Apartment, ReflectionForm, \
    Survey, Answer, Vehicle, ReservationVehicle,Response, User, Question


class ResidentFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidentFee
        fields = '__all__'


class MonthlyFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyFee
        fields = '__all__'


class ResidentSerializer(serializers.ModelSerializer):
    monthly_fees = MonthlyFeeSerializer(many=True, read_only=True)

    class Meta:
        model = Resident
        fields = ['user_infor_id', 'monthly_fees']


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReflectionForm
        fields = '__all__'


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
#
# class ItemSerializer(serializers.ModelSerializer):
#     def to_representation(self, instance):
#         rep = super().to_representation(instance)
#         rep['image'] = instance.image.url
#
#         return rep
#
#
# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']
#
#
# class CourseSerializer(ItemSerializer):
#     class Meta:
#         model = Course
#         fields = ['id', 'name', 'image', 'created_date', 'updated_date', 'category']
#
#
# class LessonSerializer(ItemSerializer):
#     class Meta:
#         model = Lesson
#         fields = ['id', 'subject', 'image', 'created_date', 'updated_date']
#
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
#
#
# class CommentSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#
#     class Meta:
#         model = Comment
#         fields = ['id', 'content', 'created_date', 'user']
