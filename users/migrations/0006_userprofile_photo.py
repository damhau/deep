# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-20 06:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_activitylog'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='photo',
            field=models.FileField(blank=True, default=None, null=True, upload_to='group-avatar/'),
        ),
    ]