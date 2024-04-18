from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from enum import Enum
from django_enum_choices.fields import EnumChoiceField
from django.utils.translation import gettext_lazy as _



class Apartment(models.Model):
    class EnumRoom(models.IntegerChoices):
        ROOM_1 = 1, 'Room 1'
        ROOM_2 = 2, 'Room 2'
        ROOM_3 = 3, 'Room 3'

    name = models.CharField(max_length = 20, unique = True,primary_key=True)
    floor = models.IntegerField()
    room = models.IntegerField(choices =EnumRoom.choices, default = EnumRoom.ROOM_2)

    def management_fee(self):
        return self.management_service.price * self.room


class BaseUser(AbstractUser):

    class EnumRole(models.TextChoices):
        RESIDENT = 'Resident'
        MANAGER = 'Manager'

    class EnumSex(models.TextChoices):
        MALE = 'Male'
        FEMALE = 'Female'

    role = models.CharField(max_length=20, choices=EnumRole.choices, default=EnumRole.RESIDENT)
    phone = models.CharField(max_length = 15, null = True)
    sex = models.CharField(max_length = 20, choices=EnumSex.choices, default = EnumSex.MALE)
    avatar = CloudinaryField('avatar', null=True)
    created = models.DateField(auto_now_add=True, null = True)
    change_password_required = models.BooleanField(default=True)

    class Meta:
        abstract= True

    def __str__(self):
        return self.username


class Resident(BaseUser):
    groups = models.ManyToManyField('auth.Group', related_name='resident_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='resident_user_permissions')

    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, null = True)




class Manager(BaseUser):
    groups = models.ManyToManyField('auth.Group', related_name='manager_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='manager_user_permissions')

    area = models.CharField(max_length = 20, null = True)



class BaseService(models.Model):
    name = models.CharField(max_length= 30, primary_key = True)
    description= models.TextField(max_length=50)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
         abstract = True


class MonthlyFee(BaseService):
    price = models.IntegerField()
    residents = models.ManyToManyField(Resident,through='ResidentFee')


class Vehicle(BaseService):
    price = models.IntegerField()


class ReservationVehicle(MonthlyFee):
    vehicle = models.ForeignKey(Vehicle, on_delete = models.CASCADE)
    vehicle_number = models.CharField(max_length=10)




class ResidentFee(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    fee = models.ForeignKey(MonthlyFee, on_delete=models.CASCADE)

    payment_method = models.CharField(max_length=50)
    payment_proof = CloudinaryField(null=True)
    payment_date = models.DateField(auto_now_add=True)
    status= models.BooleanField(default = False)
    amount = models.IntegerField(default=1)


class ElectronicLockerItem(models.Model):
    resident = models.OneToOneField(Resident, related_name='resident', null=False, primary_key=True, on_delete=models.CASCADE)
    status = models.BooleanField(default = False)



class Item(models.Model):
    name = models.CharField(max_length = 20)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    status = models.BooleanField(default = True)

    electronic_lock = models.ForeignKey(ElectronicLockerItem, on_delete = models.CASCADE)







class Survey(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null = True)

    def __str__(self):
        return self.title

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    letter = models.CharField(max_length=1, help_text="A, B, C, D")

    def __str__(self):
        return f"{self.letter}: {self.text}"

class Response(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    resident_id = models.IntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    response = models.ForeignKey(Response, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('response', 'question')  # Each question can only be answered once per response

    def __str__(self):
        return f"{self.question.text} - {self.choice.letter}"




class User(AbstractUser):
    avatar = CloudinaryField(null=True)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ItemBase(BaseModel):
    tags = models.ManyToManyField(Tag)

    class Meta:
        abstract = True


class Course(ItemBase):
    name = models.CharField(max_length=255)
    description = RichTextField()
    image = CloudinaryField(null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Lesson(ItemBase):
    subject = models.CharField(max_length=255)
    content = RichTextField()
    image = CloudinaryField(null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user_id} - {self.lesson_id}'

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255)


class Like(Interaction):

    class Meta:
        unique_together = ('user', 'lesson')
