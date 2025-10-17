from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from exercises.views import ExerciseViewSet
from feedback.views import FeedbackViewSet
from student.views import StudentViewSet
from teachers.views import TeacherViewSet
from training.views import TrainingViewSet
from users.views import UserViewSet
from diet.views import FoodItemViewSet, DietPlanViewSet, MealViewSet

router = routers.DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'teachers', TeacherViewSet, basename='teacher')
router.register(r'training', TrainingViewSet, basename='training')
router.register(r'users', UserViewSet, basename='user')
router.register(r'food-items', FoodItemViewSet, basename='fooditem')
router.register(r'diet-plans', DietPlanViewSet, basename='dietplan')
router.register(r'meals', MealViewSet, basename='meal')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/analytics/', include('analytics.urls')),
    path('api/diet/', include('diet.urls')),
    path('api/tracking/', include('tracking.urls')),
]