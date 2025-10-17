from rest_framework import serializers 
from .models import WorkoutSession, ExerciseLog, SetLog
from training.serializers import WorkoutExerciseSerializer
from exercises.serializers import ExerciseSerializer

class SetLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SetLog
        fields = ['id', 'exercise_log', 'set_number', 'repetitions', 'weight', 'rest_time', 'notes', 'is_pr', 'created_at']
        read_only_fields = ['created_at']

class ExerciseLogSerializer(serializers.ModelSerializer):
    workout_exercise = WorkoutExerciseSerializer(read_only=True)
    exercise = ExerciseSerializer(read_only=True)
    set_logs = SetLogSerializer(many=True, read_only=True)

    class Meta:
        model = ExerciseLog
        fields = [
            'id',
            'session',
            'exercise',
            'workout_exercise',
            'order', 
            'notes',
            'set_logs',
            'created_at',
        ]
        read_only_fields = ['created_at']

class WorkoutSessionSerializer(serializers.ModelSerializer):
    exercise_logs = ExerciseLogSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutSession
        fields = ['id', 'user', 'workout', 'date', 'started_at', 'ended_at', 'status', 'notes', 'exercise_logs', 'created_at']
        read_only_fields = ['created_at']