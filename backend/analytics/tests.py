from django.test import TestCase
from .models import PersonalRecord, BodyMeasurement, ProgressPhoto
from rest_framework import viewsets
from .serializers import PersonalRecordSerializer, BodyMeasurementSerializer, ProgressPhotoSerializer