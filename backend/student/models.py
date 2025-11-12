from django.db import models

class Student(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='student_profile')
    age = models.PositiveIntegerField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - Student"

class ProgressLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='progress_logs')
    date = models.DateField()
    height = models.FloatField(blank=True, null=True)
    goal_weight = models.FloatField(blank=True, null=True)
    current_weight = models.FloatField()
    start_weight = models.FloatField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    imc = models.FloatField(blank=True, null=True)
    body_fat_percentage = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.student.user.username} - {self.date}"
    
class PhotosStudent(models.Model):
    POSITION = [
        ('front', 'Front'),
        ('side', 'Side'),
        ('back', 'Back'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='student_photos/')
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    position = models.CharField(max_length=10, choices=POSITION)
    
    def __str__(self):
        return f"Photo of {self.student.user.username} uploaded on {self.uploaded_at}"