from rest_framework import serializers
from apartment.models import *
from django.contrib.auth.hashers import make_password
import cloudinary
import cloudinary.uploader
import cloudinary.api


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        avatar_url = representation.get('avatar')
        if avatar_url and avatar_url.startswith('image/upload/'):
            # Remove 'image/upload/' prefix
            avatar_url = avatar_url.replace('image/upload/', '', 1)
            representation['avatar'] = avatar_url
        return representation

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
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'role', 'avatar', 'sex']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ResidentSerializer(serializers.ModelSerializer):
    user_info = UserSerializer()

    class Meta:
        model = Resident
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    user_info = UserSerializer()

    class Meta:
        model = Manager
        fields = ['user_info', 'area']


class ServiceSerializer(serializers.ModelSerializer):
    residents = ResidentSerializer(many=True)

    class Meta:
        model = Service
        fields = '__all__'


class ResidentFeeSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer
    fee = ServiceSerializer

    class Meta:
        model = ResidentFee
        fields = '__all__'


class ReservationVehicleSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer

    class Meta:
        model = ReservationVehicle
        fields = '__all__'


class ElectronicLockerItemSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer()

    class Meta:
        model = ElectronicLockerItem
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer

    class Meta:
        model = Question
        fields = ['content', 'choices']


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Survey
        fields = ['title', 'questions']


class ResponseSerializer(serializers.ModelSerializer):
    survey = SurveySerializer()
    resident = ResidentSerializer()

    class Meta:
        model = Response
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    # response = ResponseSerializer
    # question = QuestionSerializer
    # choice = ChoiceSerializer

    class Meta:
        model = Answer
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer

    class Meta:
        model = Report
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
