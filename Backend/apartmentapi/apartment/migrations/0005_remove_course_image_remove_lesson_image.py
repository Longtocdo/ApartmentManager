# Generated by Django 5.0.3 on 2024-03-05 09:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("apartment", "0004_tag_lesson_comment_course_tags_like"),
    ]

    operations = [
        migrations.RemoveField(model_name="course", name="image",),
        migrations.RemoveField(model_name="lesson", name="image",),
    ]
