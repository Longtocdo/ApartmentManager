# Generated by Django 5.0.3 on 2024-03-05 09:18

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("apartment", "0005_remove_course_image_remove_lesson_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="image",
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="lesson",
            name="image",
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="avatar",
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
    ]
