from .models import VideoLesson
from rest_framework import serializers

class VideoLessonSerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = VideoLesson
        fields = [
            'id', 
            'teacher', 
            'title', 
            'description', 
            'video_file',
            'url_youtube',
            'created_at',
            'updated_at',
            'category'
            ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        