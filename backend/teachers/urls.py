from django.urls import path, include
from .views import TeacherViewSet, TeacherStudentView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'teachers', TeacherViewSet, basename='teacher')
router.register(r'teacher-students', TeacherStudentView, basename='teacher-student')

urlpatterns = [
    path('', include(router.urls)),
]