from .views import (
    WorkoutSessionViewSet,
    ExerciseLogViewSet,
    SetLogViewSet,
)
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'workout-sessions', WorkoutSessionViewSet, basename='workoutsession')
router.register(r'exercise-logs', ExerciseLogViewSet, basename='exerciselog')
router.register(r'set-logs', SetLogViewSet, basename='setlog')

urlpatterns = [
    path('', include(router.urls)),
]