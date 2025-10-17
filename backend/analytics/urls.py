from .views import PersonalRecordViewSet, BodyMeasurementViewSet, ProgressPhotoViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'personal-records', PersonalRecordViewSet, basename='personalrecord')
router.register(r'body-measurements', BodyMeasurementViewSet, basename='bodymeasurement')
router.register(r'progress-photos', ProgressPhotoViewSet, basename='progressphoto')

urlpatterns = [
    path('', include(router.urls)),
]
