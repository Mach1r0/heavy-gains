from django.db import models

class VideoLesson(models.Model):
    CATEGORY_CHOICES = [ 
        ('teoria', 'Teoria'),
        ('tecnica', 'Técnica'),
        ('pratica', 'Prática'),
        ('nutricao', 'Nutrição'),
        ('cutting', 'Cutting'),
        ('bulking', 'Bulking'),
        ('nutricao_esportiva', 'Nutrição Esportiva'),
        ('suplementacao', 'Suplementação'),
        ('recuperacao', 'Recuperação Muscular'),
        ('mobilidade', 'Alongamento e Mobilidade'),
    ]

    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='video_lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_file = models.FileField(upload_to='video_lessons/')
    url_youtube = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default='teoria') 

    def __str__(self):
        return self.title