# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-21 08:18
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0003_auto_20161121_0806'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='end_date',
            field=models.DateField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='start_date',
            field=models.DateField(default=datetime.datetime(2016, 1, 1, 0, 0)),
        ),
    ]
