from django.db import models

class Training(models.Model):
    GOAL_CHOICES = [ 
        ('STR', 'Strength'),
        ('HYP', 'Hypertrophy'),
        ('END', 'Endurance'),
        ('WL', 'Weight Loss'),
        ('GEN', 'General Fitness'),
    ]

    student = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='StudentTraining')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='TeacherTraining')
    goal = models.CharField(max_length=5, choices=GOAL_CHOICES)
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class Workout(models.Model):
    DAY_CHOICES = [
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    ]
    
    training_plan = models.ForeignKey(Training, on_delete=models.CASCADE, related_name='workouts')
    name = models.CharField(max_length=100)
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)

class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='workout_exercises')
    exercise = models.ForeignKey('exercises.Exercise', on_delete=models.CASCADE, related_name='exercise_workouts')
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    rest_time = models.DurationField(help_text="Rest time between sets (e.g., 00:01:30 for 1 minute 30 seconds)")
    notes = models.TextField(blank=True, null=True)
