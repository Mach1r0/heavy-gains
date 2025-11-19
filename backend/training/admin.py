from django.contrib import admin
from .models import Program, Training, Workout, WorkoutExercise

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['name', 'teacher', 'goal', 'is_active', 'created_at']
    list_filter = ['goal', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'teacher__user__username']

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ['name', 'student', 'teacher', 'program', 'goal', 'is_active', 'start_date']
    list_filter = ['goal', 'is_active', 'start_date']
    search_fields = ['name', 'description', 'student__user__username', 'teacher__user__username']

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'training_plan', 'day_of_week']
    list_filter = ['day_of_week']
    search_fields = ['name', 'training_plan__name']

@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ['workout', 'exercise', 'sets', 'reps', 'rest_time']
    search_fields = ['workout__name', 'exercise__name']
