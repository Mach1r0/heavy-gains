from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        user = serializers.StringRelatedField(read_only=True)
        receiver = serializers.StringRelatedField(read_only=True)
        model = Feedback
        fields = [ 
            'id', 
            'user', 
            'receiver',
            'rating',
            'message',
            'created_at',
        ]        
        read_only_fields = ['id', 'user', 'receiver', 'created_at']