# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-13 11:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0021_country_media_sources'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='regions',
            field=models.TextField(default='{}'),
        ),
    ]