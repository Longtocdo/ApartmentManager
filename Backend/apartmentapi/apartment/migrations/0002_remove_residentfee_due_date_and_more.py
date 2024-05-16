# Generated by Django 5.0.3 on 2024-05-16 01:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='residentfee',
            name='due_date',
        ),
        migrations.AddField(
            model_name='reservationvehicle',
            name='resident',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='apartment.resident'),
        ),
    ]