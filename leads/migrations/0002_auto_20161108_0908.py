# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-11-08 09:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='assessmentconfidentiality',
            options={'verbose_name_plural': 'Assessment Confidentialities'},
        ),
        migrations.AlterModelOptions(
            name='assessmentfrequency',
            options={'verbose_name_plural': 'Assessment Frequencies'},
        ),
        migrations.AlterModelOptions(
            name='assessmentstatus',
            options={'verbose_name_plural': 'Assessment Statuses'},
        ),
        migrations.AlterModelOptions(
            name='datacollectiontechnique',
            options={'verbose_name_plural': 'Data Collection Techniques'},
        ),
        migrations.AlterModelOptions(
            name='proximitytosource',
            options={'verbose_name_plural': 'Proximity to Sources'},
        ),
        migrations.AlterModelOptions(
            name='samplingtype',
            options={'verbose_name_plural': 'Sampling Types'},
        ),
        migrations.AlterModelOptions(
            name='sectoranalyticalvalue',
            options={'verbose_name_plural': 'Sector Analytical Values'},
        ),
        migrations.AlterModelOptions(
            name='sectorcovered',
            options={'verbose_name_plural': 'Sectors Covered'},
        ),
        migrations.AlterModelOptions(
            name='surveyofsurvey',
            options={'verbose_name_plural': 'Survey of Surveys'},
        ),
        migrations.AlterModelOptions(
            name='unitofanalysis',
            options={'verbose_name_plural': 'Units of Analysis'},
        ),
    ]
