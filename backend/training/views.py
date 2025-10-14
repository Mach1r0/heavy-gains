from django.shortcuts import render
from rest_framework import viewsets
from .serializers import trainingSerializer
from rest_framework import permissions
from .models import Training


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = trainingSerializer
    permission_classes = [permissions.IsAuthenticated]