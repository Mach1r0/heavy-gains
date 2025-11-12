from django.shortcuts import render
from rest_framework import viewsets
from .serializers import * 
from rest_framework import permissions
    
class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

class DietPlanViewSet(viewsets.ModelViewSet):
    queryset = DietPlan.objects.all()
    serializer_class = DietPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DietPlanCreateSerializer
        return DietPlanSerializer

class MealFoodItemViewSet(viewsets.ModelViewSet):
    queryset = MealFoodItem.objects.all()
    serializer_class = MealFoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated] 