from django.contrib import admin
from django.urls import path, include
from videoLesson.views import VideoLessonViewSet
from rest_framework import routers
from exercises.views import ExerciseViewSet
from feedback.views import FeedbackViewSet
from student.views import StudentViewSet
from teachers.views import TeacherViewSet
from training.views import TrainingViewSet, ProgramViewSet, WorkoutViewSet, WorkoutExerciseViewSet
from users.views import UserViewSet
from diet.views import FoodItemViewSet, DietPlanViewSet, MealViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = routers.DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'training', TrainingViewSet, basename='training')
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'training/workouts', WorkoutViewSet, basename='workout')
router.register(r'training/workout-exercises', WorkoutExerciseViewSet, basename='workout-exercise')
router.register(r'food-items', FoodItemViewSet, basename='fooditem')
router.register(r'diet-plans', DietPlanViewSet, basename='dietplan')
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'video-lessons', VideoLessonViewSet, basename='video-lesson')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/analytics/', include('analytics.urls')),
    path('api/diet/', include('diet.urls')),
    path('api/tracking/', include('tracking.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/', include('users.urls')),
    path('api/trainer/', include('teachers.urls')),
]