# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-04 09:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0015_auto_20170104_0852'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='country',
            options={'ordering': ['name'], 'verbose_name_plural': 'countries'},
        ),
        migrations.AddField(
            model_name='country',
            name='hdi_rank',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
