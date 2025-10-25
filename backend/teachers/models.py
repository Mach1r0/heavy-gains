from django.db import models

class Teacher(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='teacher_profile')
    feedback_score = models.FloatField(default=0.0)
    profile_picture = models.ImageField(upload_to='teachers/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    bio = models.TextField(blank=True, null=True)
    specialties = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return self.user.username
        