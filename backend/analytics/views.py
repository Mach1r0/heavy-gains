from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PersonalRecordSerializer, BodyMeasurementSerializer, ProgressPhotoSerializer
from rest_framework import permissions
from .models import PersonalRecord, BodyMeasurement, ProgressPhoto

class PersonalRecordViewSet(viewsets.ModelViewSet):
    queryset = PersonalRecord.objects.all()
    serializer_class = PersonalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

class BodyMeasurementViewSet(viewsets.ModelViewSet):
    queryset = BodyMeasurement.objects.all()
    serializer_class = BodyMeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProgressPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProgressPhoto.objects.all()
    serializer_class = ProgressPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
