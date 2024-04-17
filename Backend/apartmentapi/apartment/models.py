from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from enum import Enum
from django_enum_choices.fields import EnumChoiceField
from django.utils.translation import gettext_lazy as _


class EnumRole(models.TextChoices):
    RESIDENT = 'Resident'
    MANAGER = 'Manager'

class BaseUser(AbstractUser):
    avatar = models.ImageField(null=True)
    role = models.CharField(max_length=20, choices=EnumRole.choices, default=EnumRole.RESIDENT)

    class Meta:
        abstract = True



class Resident(BaseUser):
    id = models.AutoField(primary_key=True)
    nha = models.CharField(max_length=50)
    groups = models.ManyToManyField('auth.Group', related_name='resident_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='resident_user_permissions')

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
