from django.db import models

class Feedback(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='feedbacks')
    receiver = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='received_feedbacks')
    rating = models.PositiveIntegerField(default=0)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.username} to {self.receiver.username} at {self.created_at}"