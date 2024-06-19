from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from enum import Enum
from django_enum_choices.fields import EnumChoiceField
from django.contrib.auth.hashers import make_password
import cloudinary.uploader


class User(AbstractUser):
    class EnumRole(models.TextChoices):
        RESIDENT = 'Cư Dân'
        MANAGER = 'Quản Lý'

    class EnumSex(models.TextChoices):
        MALE = 'Nam'
        FEMALE = 'Nữ'

    role = models.CharField(max_length=20, choices=EnumRole.choices, default=EnumRole.RESIDENT)
    phone = models.CharField(max_length=15, null=True)
    sex = models.CharField(max_length=20, choices=EnumSex.choices, default=EnumSex.MALE)
    avatar = CloudinaryField(null=True)
    created = models.DateField(auto_now_add=True, null=True)
    is_first_login = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Apartment(models.Model):
    class EnumRoom(models.IntegerChoices):
        ROOM_1 = 1, 'Room 1'
        ROOM_2 = 2, 'Room 2'
        ROOM_3 = 3, 'Room 3'

    name = models.CharField(max_length=20, unique=True)
    floor = models.IntegerField(default=1)
    room = models.IntegerField(choices=EnumRoom.choices, default=EnumRoom.ROOM_2)

    def management_fee(self):
        return self.management_service.price * self.room

    def __str__(self):
        return self.name


class Resident(models.Model):
    user_info = models.OneToOneField(User, related_name='resident_profile', primary_key=True, on_delete=models.CASCADE,
                                     null=False)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, null=True, related_name='apartments')

    def __str__(self):
        return "RD." + " " + self.user_info.first_name + " " + self.user_info.last_name


class Manager(models.Model):
    user_info = models.OneToOneField(User, related_name='manager_profile', primary_key=True, null=False,
                                     on_delete=models.CASCADE)
    area = models.CharField(max_length=20, null=True)

    def __str__(self):
        return "Mn." + self.user_info.first_name + " " + self.user_info.last_name


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True, null=True)
    updated_date = models.DateField(auto_now=True, null=True)

    class Meta:
        abstract = True


class Service(BaseModel):
    class EnumServiceType(models.TextChoices):
        Svc1 = 'Nha', 'Tiền nhà'
        Svc2 = 'Dien', 'Tiền điện'
        Svc3 = 'Dich vu', 'Tiền phí dịch vụ'

    fee_name = models.CharField(max_length=30)
    price = models.IntegerField(null=True)
    types = models.CharField(max_length=50, choices=EnumServiceType.choices, default=EnumServiceType.Svc1, null=True)

    residents = models.ManyToManyField(Resident, through='ResidentFee', related_name='service')

    def __str__(self):
        return self.fee_name


class ResidentFee(models.Model):
    class EnumPayment(models.TextChoices):
        PM1_1 = 'Chuyển khoản Ngân Hàng', 'Chuyển khoản Ngân Hàng'
        PM2_2 = 'Chuyển khoản Momo', 'Chuyển khoản MoMo'

    class EnumStatusFee(models.TextChoices):
        PENDING = 'Đang chờ xử lý', 'Đang xử lý'
        DENY = 'Không thể xử lý', 'Thất Bại'
        DONE = 'Thành Công', 'Thành Công'

    payment_method = models.CharField(choices=EnumPayment.choices, max_length=50, null=True)
    payment_proof = CloudinaryField(null=True)
    payment_date = models.DateField(auto_now_add=True, null=True)
    created_date = models.DateField(auto_now_add=True, null=True)
    status = models.CharField(max_length=50, choices=EnumStatusFee.choices, default=EnumStatusFee.PENDING)
    amount = models.IntegerField(default=1)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE, related_name='resident_fees')
    fee = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='resident_fees')

    def __str__(self):
        return self.resident.__str__() + " / " + self.fee.fee_name


class ReservationVehicle(Service):
    class EnumStatus(models.TextChoices):
        PENDING = 'Đang chờ xử lý', 'Đang chờ xử lý'
        DENY = 'Không thể xử lý', 'Không thể xử lý'
        DONE = 'Đã đăng ký', 'Đã đăng ký'

    vehicle_number = models.CharField(max_length=10)
    vehicle_owner = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=EnumStatus.choices, default=EnumStatus.PENDING)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE, null=True, related_name='reservations')

    def __str__(self):
        return "Reservation for" + str(self.residents)


class ElectronicLockerItem(BaseModel):
    name = models.CharField(max_length=30, default='Tủ đồ')

    apartment = models.OneToOneField(Apartment, related_name='electronic_locker', null=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Item(BaseModel):
    status = models.BooleanField(default=True)
    item_name = models.CharField(max_length=255, null=True, default='Tên sản phẩm')
    electronic_lock = models.ForeignKey(ElectronicLockerItem, on_delete=models.CASCADE, related_name='items')
    received_date = models.DateField(auto_now=True, null=True)
    created_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.item_name


class Survey(BaseModel):
    title = models.CharField(max_length=30)
    data_expire = models.DateField()
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Question(BaseModel):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    content = models.CharField(max_length=30)

    def __str__(self):
        return self.content


class Choice(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    content_choice = models.CharField(max_length=30)
    letter = models.CharField(max_length=1, help_text="A, B, C, D")

    def __str__(self):
        return self.content_choice


class Response(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='response')
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE, related_name='response')
    submitted_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.survey) + " of" + " " + str(self.resident)


class Answer(models.Model):
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name='answers', null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name='answers')

    class Meta:
        unique_together = ('response', 'question')  # Each question can only be answered once per response

    def __str__(self):
        return f"{self.question.content} - {self.choice.letter}"


class Report(BaseModel):
    class EnumStatus(models.TextChoices):
        PENDING = 'Đang chờ xử lý'
        DENY = 'Không thể xử lý'
        DONE = 'Đã xử lý'

    resident = models.ForeignKey(Resident, on_delete=models.CASCADE, related_name='reflection_forms')
    title = models.CharField(max_length=30)
    content = models.TextField(max_length=50, null=True)
    status = models.CharField(max_length=20, choices=EnumStatus.choices, default=EnumStatus.PENDING)

    def __str__(self):
        return self.title.__str__()


class Post(BaseModel):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=40, null=True)
    content = models.CharField(max_length=50, null=True)
    image = CloudinaryField(null=True)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='post_manager')

    def __str__(self):
        return self.title.__str__()
