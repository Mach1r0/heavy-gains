from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TeacherSerializer
from .models import Teacher
from rest_framework import permissions

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]
