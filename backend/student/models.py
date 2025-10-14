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