from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime
import holidays

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

class ScheduleTeacher(models.Model):
    DAYS_OF_WEEK = [ 
        (0, 'Segunda-feira'),
        (1, 'Terça-feira'),
        (2, 'Quarta-feira'),
        (3, 'Quinta-feira'),
        (4, 'Sexta-feira'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)  
    start_time = models.TimeField()  
    end_time = models.TimeField()    
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']
        verbose_name = 'Horário Semanal'
        verbose_name_plural = 'Horários Semanais'
    
    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('Horário de início deve ser antes do horário de término')
    
    def __str__(self):
        return f"{self.teacher.user.username} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"

class ScheduleException(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='schedule_exceptions')
    date = models.DateField()
    is_available = models.BooleanField(default=False)
    reason = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)  
    end_time = models.TimeField(blank=True, null=True)    

    class Meta: 
        ordering = ['date']
        verbose_name = 'Exceção de Horário'
        verbose_name_plural = 'Exceções de Horário'
    
    def __str__(self):
        status = "Disponível" if self.is_available else "Indisponível"
        return f"{self.teacher.user.username} - {self.date} ({status})"
    
    @staticmethod
    def is_holiday(date):  
        br_holidays = holidays.Brazil(years=date.year)  
        return date in br_holidays
    
    @staticmethod
    def get_holiday_name(date): 
        br_holidays = holidays.Brazil(years=date.year)
        return br_holidays.get(date, None)

class Appointment(models.Model):
    STATUS_CHOICES = [ 
        ('pending', 'Pendente'),
        ('confirmed', 'Confirmado'),
        ('cancelled', 'Cancelado'),
        ('completed', 'Concluído'),
    ]

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='appointments')
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='appointments')  
    date = models.DateField()
    start_time = models.TimeField()  
    end_time = models.TimeField()    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta: 
        ordering = ['-date', '-start_time']  
        verbose_name = 'Agendamento'
        verbose_name_plural = 'Agendamentos'
    
    def __str__(self):
        return f"{self.teacher.user.username} - {self.student.user.username} - {self.date} {self.start_time}"