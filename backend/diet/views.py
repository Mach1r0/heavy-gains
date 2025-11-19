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
    
    def get_queryset(self):
        queryset = DietPlan.objects.all()
        student_id = self.request.query_params.get('student', None)
        teacher_id = self.request.query_params.get('teacher', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
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