from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import PersonalRecordSerializer, BodyMeasurementSerializer, ProgressPhotoSerializer
from .models import PersonalRecord, BodyMeasurement, ProgressPhoto

class PersonalRecordViewSet(viewsets.ModelViewSet):
    queryset = PersonalRecord.objects.all()
    serializer_class = PersonalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

class BodyMeasurementViewSet(viewsets.ModelViewSet):
    queryset = BodyMeasurement.objects.all()
    serializer_class = BodyMeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = BodyMeasurement.objects.all()
        user_id = self.request.query_params.get('user', None)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset

class ProgressPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProgressPhoto.objects.all()
    serializer_class = ProgressPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = ProgressPhoto.objects.all()
        user_id = self.request.query_params.get('user', None)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset
