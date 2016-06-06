# -*- coding: utf-8 -*-

from __future__ import print_function

from StringIO import StringIO
import csv
import re

import requests

from django.core.management.base import BaseCommand

from mapit.models import Area, Generation


office_data_url = 'https://docs.google.com/a/mysociety.org/spreadsheets/d/1bjYtGjCVill5mQPeqVgYF6nHAsyGcEnR0ZmfTXqlhjE/export?format=csv&gid=0'


cons_name_fixes = {
    'North Imenti,Meru': 'North Imenti',
    'Imenti Central': 'CENTRAL IMENTI',
    'Imenti South': 'SOUTH IMENTI',
    'Chuka/ Igamban’gombe': "CHUKA/IGAMBANG'OMBE",
}


def get_most_overlapping_area(smaller_area, larger_area_type, generation):
    intersections = []
    for area in Area.objects.intersect(
        'intersects', smaller_area, [larger_area_type], generation
    ):
        # Now work out the % intersection between the two:
        self_geos_geometry = smaller_area.polygons.collect()
        if self_geos_geometry.area == 0:
            continue
        other_geos_geometry = area.polygons.collect()
        intersection = self_geos_geometry.intersection(other_geos_geometry)
        proportion_shared = intersection.area / self_geos_geometry.area
        intersections.append((proportion_shared, area))
    if not intersections:
        return None
    if len(intersections) == 1:
        result = intersections
    result = max(intersections, key=lambda x: x[0])
    return result[1]


class Command(BaseCommand):
    help = 'Import data about the location of electoral offices'

    def handle(*args, **options):
        generation = Generation.objects.current()
        r = requests.get(office_data_url)
        reader = csv.DictReader(StringIO(r.content))
        constituencies_seen = set()
        for row in reader:
            # address = row['Address']
            # phone = row['Telephone']
            region = row['Region']
            cons = re.sub(r'\s+', ' ', row['Constituency'].strip())
            cons = cons_name_fixes.get(cons, cons)
            # There seem to be some regional offices in here, which
            # aren't constituencies, AFAICT:
            if cons in ('REGION OFFICE', 'Regional Office'):
                continue
            mapit_cons = Area.objects.get(
                name__iexact=cons,
                type__code='CON',
                generation_high=generation,
            )
            constituencies_seen.add(mapit_cons.id)
            print("mapit_cons:", mapit_cons, "id:", mapit_cons.id)
            covering_province = get_most_overlapping_area(
                mapit_cons, 'PRO', generation
            )
            print("covering province:", covering_province, "=>", region)
        # Now go through each constituency in MapIt and print out any
        # that are missing so we can find out about them:
        missing = []
        for a in Area.objects.filter(
                type__code='CON',
                generation_high=generation
        ).exclude(id__in=constituencies_seen):
            # Now try to find the enclosing province:
            covering_province = get_most_overlapping_area(a, 'PRO', generation)
            missing.append((covering_province, a))
        missing.sort(key=lambda t: (t[0].name, t[1].name))
        for province, cons in missing:
            print(
                "In the province:", province,
                "couldn't find the constituency:", cons,
            )
