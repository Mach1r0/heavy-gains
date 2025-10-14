from django.db import models

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    muscle_group = models.CharField(max_length=100)
    video_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='exercises/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
