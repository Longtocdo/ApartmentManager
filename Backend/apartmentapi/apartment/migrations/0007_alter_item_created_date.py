# Generated by Django 5.0.3 on 2024-06-07 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0006_alter_post_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='created_date',
            field=models.DateField(auto_now=True),
        ),
    ]