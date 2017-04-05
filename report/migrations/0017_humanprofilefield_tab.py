# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-05 05:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0016_auto_20170405_0441'),
    ]

    operations = [
        migrations.AddField(
            model_name='humanprofilefield',
            name='tab',
            field=models.CharField(choices=[('HUM', 'Humanitarian profile'), ('CAS', 'Casualties')], default='HUM', max_length=3),
        ),
    ]
