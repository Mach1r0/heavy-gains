from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.apps import apps 
from django.utils.text import slugify

class UserManager(BaseUserManager):
    def create_user(self, name, email, username, password=None, **extra_fields):
        if not email: 
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)