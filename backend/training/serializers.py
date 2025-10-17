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
    workouts = WorkoutSerializer(many=True, read_only=True)
    
    class Meta:
        model = Training
        fields = '__all__'