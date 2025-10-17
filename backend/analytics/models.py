from django.db import models
from django.conf import settings
from django.utils import timezone  

class PersonalRecord(models.Model):
    RECORD_TYPE_CHOICES = [ 
        ('1RM', 'One Rep Max'), 
        ('REPS', 'More reps at a given weight'),
        ('WEIGHT', 'Heaviest weight lifted for a given exercise'),
        ('VOLUME', 'Max Volume'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='personal_records')
    exercise = models.ForeignKey('exercises.Exercise', on_delete=models.CASCADE, related_name='personal_records')
    record_type = models.CharField(max_length=6, choices=RECORD_TYPE_CHOICES)
    weight_kg = models.FloatField()
    reps = models.PositiveIntegerField()
    volume = models.FloatField(help_text='weight * reps', null=True, blank=True)
    estimated_1rm = models.FloatField(null=True, blank=True)
    achieved_at = models.DateField()
    previous_value = models.FloatField(null=True, blank=True)
    improvement_percent = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now) 

    def __str__(self):
        return f"{self.user.username}'s {self.record_type} for {self.exercise.name} on {self.achieved_at}"

class BodyMeasurement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_records')
    date = models.DateField()
    weight_kg = models.FloatField(null=True, blank=True)
    body_fat_percent = models.FloatField(null=True, blank=True)
    muscle_mass_kg = models.FloatField(null=True, blank=True)
    
    neck_cm = models.FloatField(null=True, blank=True)
    chest_cm = models.FloatField(null=True, blank=True)
    waist_cm = models.FloatField(null=True, blank=True)
    hips_cm = models.FloatField(null=True, blank=True)
    bicep_left_cm = models.FloatField(null=True, blank=True)
    bicep_right_cm = models.FloatField(null=True, blank=True)
    forearm_left_cm = models.FloatField(null=True, blank=True)
    forearm_right_cm = models.FloatField(null=True, blank=True)
    thigh_left_cm = models.FloatField(null=True, blank=True)
    thigh_right_cm = models.FloatField(null=True, blank=True)
    calf_left_cm = models.FloatField(null=True, blank=True)
    calf_right_cm = models.FloatField(null=True, blank=True)

    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.weight_kg}kg"

class ProgressPhoto(models.Model):
    PHOTO_TYPE_CHOICES = [ 
         ('FRONT', 'Front'), 
         ('SIDE', 'Side'),
         ('BACK', 'Back')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_photos')
    photo_type = models.CharField(max_length=10, choices=PHOTO_TYPE_CHOICES) 
    image = models.ImageField(upload_to='progress_photos/')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.photo_type} - {self.created_at}"