from rest_framework import serializers
from .models import Training, Workout, WorkoutExercise

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'workout', 'exercise', 'sets', 'reps', 'rest_time', 'notes']

class WorkoutSerializer(serializers.ModelSerializer):
    workout_exercises = WorkoutExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id', 'training_plan', 'name', 'day_of_week', 'workout_exercises']

class trainingSerializer(serializers.ModelSerializer):
    Student = serializers.StringRelatedField(read_only=True)
    Teacher = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Training
        fields = [ 
            'id',
            'Student',
            'Teacher', 
            'goal', 
            'name', 
            'description', 
            'start_date', 
            'end_date', 
            'is_active'
        ]
        read_only_fields = ['id', 'start_date', 'end_date', 'is_active']