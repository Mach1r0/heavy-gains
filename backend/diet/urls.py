from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealViewSet, DietPlanViewSet, MealFoodItemViewSet, FoodItemViewSet

router = DefaultRouter()
router.register(r'meals', MealViewSet)
router.register(r'diet-plans', DietPlanViewSet)
router.register(r'meal-food-items', MealFoodItemViewSet)
router.register(r'food-items', FoodItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]