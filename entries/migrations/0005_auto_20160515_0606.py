# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-15 06:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0004_auto_20160515_0600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='country',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='entries.Country'),
        ),
    ]
