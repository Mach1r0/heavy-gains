from rest_framework import serializers
from .models import Training 

class trainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = '__all__'