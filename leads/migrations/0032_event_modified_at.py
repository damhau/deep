# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-02 07:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0031_event_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]