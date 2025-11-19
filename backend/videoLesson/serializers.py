from teachers.models import Teacher
from .models import VideoLesson
from rest_framework import serializers

class VideoLessonSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())

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
            'category',
            'state',
            'for_all',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']