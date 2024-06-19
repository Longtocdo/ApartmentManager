from rest_framework import serializers
from apartment.models import *
import cloudinary
import cloudinary.uploader
import cloudinary.api


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        avatar_url = representation.get('avatar')
        if avatar_url and avatar_url.startswith('image/upload/'):
            avatar_url = avatar_url.replace('image/upload/', '', 1)
            representation['avatar'] = avatar_url
        return representation

    def create(self, validated_data):
        is_superuser = validated_data.pop('is_superuser', False)

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
        fields = ['id', 'phone', 'first_name', 'last_name', 'email', 'username', 'password', 'role', 'avatar', 'sex',
                  'is_first_login']
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
    class Meta:
        model = Service
        fields = '__all__'


class ResidentFeeSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer
    fee = ServiceSerializer()

    class Meta:
        model = ResidentFee
        fields = '__all__'


class ReservationVehicleSerializer(serializers.ModelSerializer):
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
        fields = ['id', 'content_choice']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Survey
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['question', 'choice']


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, write_only=True)

    class Meta:
        model = Response
        fields = ['survey', 'resident', 'answers']

    def validate_answers(self, value):
        # Check for duplicate questions in answers
        question_ids = [answer['question'].id for answer in value]
        if len(question_ids) != len(set(question_ids)):
            raise serializers.ValidationError("Each question must be answered only once.")
        return value

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        response = Response.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(response=response, **answer_data)
        return response


class ReportSerializer(serializers.ModelSerializer):
    resident = ResidentSerializer

    class Meta:
        model = Report
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
