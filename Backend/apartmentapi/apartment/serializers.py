from rest_framework import serializers
from apartment.models import *
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):

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


class ResidentSerializer(serializers.ModelSerializer):
    user_info = UserSerializer()

    class Meta:
        model = Resident
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer()

    class Meta:
        model = Apartment
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    user_info = UserSerializer()

    class Meta:
        model = Manager
        fields = ['user_info', 'area']


class MonthlyFeeSerializer(serializers.ModelSerializer):
    residents = ResidentSerializer(many=True)

    class Meta:
        model = MonthlyFee
        fields = '__all__'


class ResidentFeeSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer()
    fee = MonthlyFeeSerializer()

    class Meta:
        model = ResidentFee
        fields = '__all__'


class ReservationVehicleSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer()

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


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    survey = SurveySerializer()

    class Meta:
        model = Question
        fields = '__all__'


class ChoiceSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Choice
        fields = '__all__'


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


class ReflectionFormSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer()

    class Meta:
        model = ReflectionForm
        fields = '__all__'
