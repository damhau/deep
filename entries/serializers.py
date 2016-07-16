from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import serializers

from entries.models import *


class EntrySerializer(serializers.ModelSerializer):
    lead_name = serializers.SerializerMethodField()
    lead_type = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    information_attributes = serializers.SerializerMethodField()
    countries = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = ('id', 'lead', 'lead_name', 'lead_type',
                  'affected_groups', 'information_attributes',
                  'countries',
                  'created_at', 'created_by', 'created_by_name')

        # TODO: Automatically set created_by.

    def get_lead_name(self, entry):
        return entry.lead.name

    def get_lead_type(self, entry):
        return entry.lead.lead_type

    def get_created_by_name(self, entry):
        if entry.created_by:
            return entry.created_by.get_full_name()
        else:
            return ""

    def get_information_attributes(self, entry):
        attributes = []
        attr_data = AttributeData.objects.filter(entry=entry)
        for attr in attr_data:
            attributes.append({
                'attribute': attr.attribute.name,
                'excerpt': attr.excerpt,
                'number': attr.number,
                'reliability': attr.reliability
            })
        return attributes

    def get_countries(self, entry):
        cs = [s.admin_level.country.name for s in entry.map_selections.all()]
        return list(set(cs))


class CountrySerializer(serializers.ModelSerializer):
    admin_levels = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ('code', 'name', 'admin_levels')

    def get_admin_levels(self, country):
        levels = {}
        for level in country.adminlevel_set.all():
            levels["level"+str(level.level)] = [
                    level.name, level.property_name,
                    # str(level.geojson.read(), 'utf-8')
                    level.geojson.url
                ]
        return levels
