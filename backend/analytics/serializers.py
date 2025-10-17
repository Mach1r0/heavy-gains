from .models import PersonalRecord, BodyMeasurement, ProgressPhoto
from rest_framework import serializers

class PersonalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalRecord
        fields = [
            'user',
            'exercise',
            'record_type',
            'weight_kg',
            'reps',
            'volume',
            'estimated_1rm',
            'achieved_at',
            'previous_value',
            'improvement_percent',
            'created_at',
            'id',
        ]
        read_only_fields = ['user', 'created_at', 'previous_value', 'improvement_percent', 'id']

class BodyMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMeasurement
        fields = [
            'user',
            'date',
            'weight_kg',
            'body_fat_percent',
            'muscle_mass_kg',
            'neck_cm',
            'chest_cm',
            'waist_cm',
            'hips_cm',
            'bicep_left_cm',
            'bicep_right_cm',
            'forearm_left_cm',
            'forearm_right_cm',
            'thigh_left_cm',
            'thigh_right_cm',
            'calf_left_cm',
            'calf_right_cm',
            'notes',
            'created_at',
            'id',
        ]
        read_only_fields = ['user', 'created_at', 'id']

class ProgressPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressPhoto
        fields = [
            'user',
            'photo_type',
            'image',
            'created_at',
            'id',
        ]
        read_only_fields = ['user', 'created_at', 'id']