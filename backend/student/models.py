from django.db import models

class Student(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='student_profile')
    age = models.PositiveIntegerField(null=True, blank=True)  
    weight = models.FloatField(null=True, blank=True)  
    height = models.FloatField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - Student"

class ProgressLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='progress_logs')
    date = models.DateField()
    weight = models.FloatField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
      
    def __str__(self):
        return f"{self.student.user.username} - {self.date}"