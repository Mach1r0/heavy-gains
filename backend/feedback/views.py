from django.shortcuts import render
from rest_framework import viewsets
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework import permissions 

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]