# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-04 10:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0016_auto_20170104_0952'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='inform_hazard_and_exposure',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='country',
            name='inform_lack_of_coping_capacity',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='country',
            name='inform_risk_index',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='country',
            name='inform_vulnerability',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
