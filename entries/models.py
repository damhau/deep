from django.db import models
from django.contrib.auth.models import User
# from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver
from django.utils import timezone

from leads.models import *

import json


class AdminLevel(models.Model):
    level = models.IntegerField()
    country = models.ForeignKey(Country)
    name = models.CharField(max_length=70)
    property_name = models.CharField(max_length=70)
    property_pcode = models.CharField(max_length=50, default="", blank=True)
    geojson = models.FileField(upload_to='adminlevels/', default=None, blank=True, null=True)

    def __str__(self):
        return self.name + ", " + str(self.country)

    class Meta:
        ordering = ['country', 'level']
        unique_together = ('country', 'level')


# @receiver(pre_delete, sender=AdminLevel)
# def _admin_level_delete(sender, instance, **kwargs):
#     instance.geojson.delete(False)


class AdminLevelSelection(models.Model):
    admin_level = models.ForeignKey(AdminLevel)
    name = models.CharField(max_length=70)
    pcode = models.CharField(max_length=50, default="", blank=True)

    def __str__(self):
        if self.pcode == "":
            return self.name + ", " + str(self.admin_level)
        else:
            return self.name + " (" + self.pcode + ")" + ", " + str(self.admin_level)

    def get_keyword(self):
        # "{{self.admin_level.country.code}}:{{self.admin_level.level|add:'-1'}}:{{self.name}}"
        if self.pcode != '':
            return str(self.admin_level.country.code) + ":" + str(self.admin_level.level) + ":" + str(self.name) + ":" + str(self.pcode)
        return str(self.admin_level.country.code) + ":" + str(self.admin_level.level) + ":" + str(self.name)


class Reliability(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField()
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Reliabilities'
        ordering = ['level']


class Severity(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField()
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Severities'
        ordering = ['level']


class AffectedGroup(models.Model):
    name = models.CharField(max_length=150)
    parent = models.ForeignKey("entries.AffectedGroup", blank=True, default=None, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Affected Groups"


class VulnerableGroup(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Vulnerable Groups"


class SpecificNeedsGroup(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Specific Needs Groups"


class InformationPillar(models.Model):
    name = models.CharField(max_length=150)
    contains_sectors = models.BooleanField(default=False)

    tooltip = models.TextField(default='', blank=True)

    background_color = models.CharField(max_length=20, default="#fbe8db")
    active_background_color = models.CharField(max_length=20, default="#ea7120")

    PEOPLE_IN_NEED = "PIN"
    HUMANITARIAN_ACCESS = "HAC"
    HUMANITARIAN_PROFILE = "HPR"
    CASUALTIES = "CAS"
    KEY_EVENTS = "KEY"

    APPEAR_IN = (
        (PEOPLE_IN_NEED, "People in need"),
        (HUMANITARIAN_ACCESS, "Humanitarian access"),
        (HUMANITARIAN_PROFILE, "Humanitarian profile"),
        (CASUALTIES, "Casualties"),
        (KEY_EVENTS, "Key events"),
    )

    appear_in = models.CharField(max_length=3, choices=APPEAR_IN,
                                 blank=True, null=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Information Pillars"


class InformationSubpillar(models.Model):
    name = models.CharField(max_length=150)
    pillar = models.ForeignKey(InformationPillar)

    tooltip = models.TextField(default='', blank=True)

    PEOPLE_IN_NEED = "PIN"
    HUMANITARIAN_ACCESS = "HAC"
    HUMANITARIAN_PROFILE = "HPR"
    CASUALTIES = "CAS"
    KEY_EVENTS = "KEY"

    APPEAR_IN = (
        (PEOPLE_IN_NEED, "People in need"),
        (HUMANITARIAN_ACCESS, "Humanitarian access"),
        (HUMANITARIAN_PROFILE, "Humanitarian profile"),
        (CASUALTIES, "Casualties"),
        (KEY_EVENTS, "Key events"),
    )

    appear_in = models.CharField(max_length=3, choices=APPEAR_IN,
                                 blank=True, null=True, default=None)

    def __str__(self):
        return self.name


class Sector(models.Model):
    name = models.CharField(max_length=150)
    icon = models.FileField(upload_to="sector-icons/", null=True, blank=True, default=None)

    def __str__(self):
        return self.name


# @receiver(pre_delete, sender=Sector)
# def _sector_delete(sender, instance, **kwargs):
#     instance.icon.delete(False)


class Subsector(models.Model):
    sector = models.ForeignKey(Sector)
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Entry(models.Model):
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, default=None, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, default=None, null=True, blank=True, related_name='entries_created')
    lead = models.ForeignKey(Lead)

    # Following is for entries entered using template
    template = models.ForeignKey('entries.EntryTemplate', default=None,  null=True)

    def __str__(self):
        return str(self.lead)

    class Meta:
        verbose_name_plural = 'Entries'


class EntryInformation(models.Model):
    entry = models.ForeignKey(Entry)
    excerpt = models.TextField(blank=True)
    image = models.TextField(blank=True, default='')

    # Following data is for old data type
    date = models.DateField(blank=True, default=None, null=True)
    reliability = models.ForeignKey(Reliability, default=None, null=True)
    severity = models.ForeignKey(Severity, default=None, null=True)
    number = models.IntegerField(blank=True, default=None, null=True)
    vulnerable_groups = models.ManyToManyField(VulnerableGroup, blank=True)
    specific_needs_groups = models.ManyToManyField(SpecificNeedsGroup, blank=True)
    affected_groups = models.ManyToManyField(AffectedGroup, blank=True)
    map_selections = models.ManyToManyField(AdminLevelSelection, blank=True)
    bob = models.BooleanField(default=False) # best of bullshits

    # Following is for entries entered using template
    elements = models.TextField(default='[]')

    def __str__(self):
        return self.excerpt


class InformationAttribute(models.Model):
    information = models.ForeignKey(EntryInformation)
    subpillar = models.ForeignKey(InformationSubpillar)
    sector = models.ForeignKey(Sector, blank=True, null=True, default=None)

    # TO DELETE
    subsector = models.ForeignKey(Subsector, blank=True, null=True, default=None, related_name='informationattribute_donot_use', verbose_name='DO NOT USE')

    subsectors = models.ManyToManyField(Subsector, blank=True)

    def __str__(self):
        return str(self.subpillar) + "/" + str(self.sector) + "/" + str(self.subsector)


class EntryTemplate(models.Model):
    name = models.CharField(max_length=150)
    elements = models.TextField(default='[]')
    snapshot_pageone = models.TextField(default=None, null=True)
    snapshot_pagetwo = models.TextField(default=None, null=True)
    created_by = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def get_admins(self):
        return User.objects.filter(
            events_owned__entry_template=self
        ).distinct()


class ExportToken(models.Model):
    token = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    data = models.TextField(blank=True)

    def __str__(self):
        return self.name
