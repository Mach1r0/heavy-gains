from django.db import models

class Student(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='student_profile')
    age = models.PositiveIntegerField()
    weight = models.FloatField()
    height = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.usernam

class ProgressLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='progress_logs')
    date = models.DateField()
    weight = models.FloatField()
    bodyfat_percentage = models.FloatField(null=True, blank=True)
    image = models.ImageField(upload_to='progress_images/', null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    