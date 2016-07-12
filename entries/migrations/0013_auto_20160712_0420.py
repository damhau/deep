# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-07-12 04:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0012_auto_20160705_0411'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttributeData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('excerpt', models.TextField(blank=True)),
                ('number', models.IntegerField(blank=True, null=True)),
                ('reliability', models.CharField(blank=True, choices=[('COM', 'Completely'), ('USU', 'Usually'), ('FAI', 'Fairly'), ('NUS', 'Not Usually'), ('UNR', 'Unreliable'), ('CBJ', 'Cannot be judged')], default=None, max_length=3, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='InformationAttribute',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='InformationAttributeGroup',
            fields=[
                ('name', models.CharField(max_length=70, primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='informationattribute',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='entries.InformationAttributeGroup'),
        ),
        migrations.AddField(
            model_name='attributedata',
            name='attribute',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='entries.InformationAttribute'),
        ),
        migrations.AddField(
            model_name='attributedata',
            name='entry',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='entries.Entry'),
        ),
    ]
