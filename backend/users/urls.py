from .models import User
from .views import LoginViewSet, UserViewSet
from student.views import StudentViewSet
from django.conf import settings 
from django.conf.urls.static import static
from django.conf.urls.static import static 
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('login/', LoginViewSet.as_view({'post': 'create'}), name='login'),
    path('register-student/', StudentViewSet.as_view({'post': 'create'}), name='register-student'),
    path('register-teacher/', UserViewSet.as_view({'post': 'create'}), name='register-teacher'),
] 
urlpatterns += router.urls