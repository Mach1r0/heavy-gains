from teachers.serializers import TeacherSerializer
from rest_framework import serializers
from .models import Meal, DietPlan, MealFoodItem, FoodItem
from student.serializers import StudentSerializer
from training.serializers import trainingSerializer

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'calories', 'protein', 'carbs', 'fats', 'category']
        read_only_fields = ['created_at', 'updated_at', 'id']

class MealFoodItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(queryset=FoodItem.objects.all(), source='food_item', write_only=True)

    class Meta:
        model = MealFoodItem
        fields = ['id', 'food_item', 'food_item_id', 'quantity', 'unit']

class DietPlanSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = DietPlan
        fields = [
            'id',
            'student',
            'teacher',
            'name',
            'goal',
            'start_date',
            'end_date',
            'is_active',
        ]
        read_only_fields = ['id', 'student', 'teacher', 'start_date', 'end_date', 'is_active']

class MealSerializer(serializers.ModelSerializer):
    food_items = MealFoodItemSerializer(many=True)
    total_calories = serializers.ReadOnlyField()
    diet_plan = DietPlanSerializer(read_only=True)
    diet_plan_id = serializers.PrimaryKeyRelatedField(queryset=DietPlan.objects.all(), source='diet_plan', write_only=True)

    class Meta: 
        model = Meal 
        fields = ['id', 'diet_plan', 'diet_plan_id', 'name', 'time', 'description', 'food_items', 'total_calories']