# Generated by Django 5.0.3 on 2024-05-20 09:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_locked',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='apartment',
            name='floor',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='reservationvehicle',
            name='status',
            field=models.CharField(choices=[('Đang chờ xử lý', 'Đang chờ xử lý'), ('Không thể xử lý', 'Không thể xử lý'), ('Đã đăng ký', 'Đã đăng ký')], default='Đang chờ xử lý', max_length=50),
        ),
        migrations.AlterField(
            model_name='residentfee',
            name='payment_method',
            field=models.CharField(choices=[('Chuyển khoản Ngân Hàng', 'Chuyển khoản Ngân Hàng'), ('Chuyển khoản Ngân 4', 'Chuyển khoản MoMo'), ('Chuyển khoản Ngân 2', 'Tiền mặt')], default='Chuyển khoản Ngân Hàng', max_length=50),
        ),
    ]
