from django.shortcuts import render
from rest_framework import viewsets
from .models import VideoLesson
from .serializers import VideoLessonSerializer
from rest_framework import filters
from rest_framework import permissions

class VideoLessonViewSet(viewsets.ModelViewSet):
    queryset = VideoLesson.objects.all()
    serializer_class = VideoLessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'teacher__name']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']  