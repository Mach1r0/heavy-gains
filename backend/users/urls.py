from .models import User
from .views import LoginViewSet, UserViewSet
from student.views import StudentViewSet
from django.conf import settings 
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView, 
    TokenRefreshView,
    TokenVerifyView,
)
from django.conf.urls.static import static 
from django.urls import path


urlpatterns = [
    path('login/', LoginViewSet.as_view({'post': 'create'}), name='login'),
    path('register-student/', StudentViewSet.as_view({'post': 'create'}), name='register'),
    path('register-teacher/', UserViewSet.as_view({'post': 'create'}), name='register'),
]