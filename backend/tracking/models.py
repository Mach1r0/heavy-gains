from django.db import models
from django.conf import settings

class WorkoutSession(models.Model):
    STATUS_CHOICES = [
        ('CMP', 'Completed'),
        ('SKP', 'Skipped'),
        ('PLN', 'Planned'),
        ('INP', 'In Progress'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_sessions')
    workout = models.ForeignKey('training.Workout', on_delete=models.CASCADE, related_name='sessions')
    date = models.DateField()
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default='PLN')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.workout.name} on {self.date} for {self.user.username}"
    
class ExerciseLog(models.Model):
    session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='exercise_logs')
    exercise = models.ForeignKey('exercises.Exercise', on_delete=models.PROTECT)
    workout_exercise = models.ForeignKey('training.WorkoutExercise', on_delete=models.SET_NULL, null=True, blank=True)
    order = models.PositiveIntegerField() 
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.exercise.name} in session {self.session.id}"

class SetLog(models.Model):
    TYPE = [ 
        ('WARM', 'Warm-up'),
        ('WORK', 'Working Set'),
        ('FEED', 'Feeder Set'),
        ('DROP', 'Drop Set'),
        ('FIN', 'Finisher'),
    ]
    
    set_type = models.CharField(max_length=4, choices=TYPE, default='WORK')
    exercise_log = models.ForeignKey(ExerciseLog, on_delete=models.CASCADE, related_name='set_logs')
    set_number = models.PositiveIntegerField()
    repetitions = models.PositiveIntegerField()
    weight = models.FloatField(help_text="Weight used in kg")
    rest_time = models.DurationField(help_text="Rest time after this set", null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    is_pr = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: 
        ordering = ['set_number']
    
    def __str__(self):
        return f"Set {self.set_number} of {self.exercise_log.exercise.name} in session {self.exercise_log.session.id}"

        