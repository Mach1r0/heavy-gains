from rest_framework import serializers
from .models import Meal, DietPlan, MealFoodItem, FoodItem

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'

class MealFoodItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(queryset=FoodItem.objects.all(), source='food_item', write_only=True)

    class Meta:
        model = MealFoodItem
        fields = ['id', 'food_item', 'food_item_id', 'quantity', 'unit']

class DietPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlan
        fields = '__all__'


class MealSerializer(serializers.ModelSerializer):
    food_items = MealFoodItemSerializer(many=True)
    total_calories = serializers.ReadOnlyField()
    diet_plan = DietPlanSerializer(read_only=True)
    diet_plan_id = serializers.PrimaryKeyRelatedField(queryset=DietPlan.objects.all(), source='diet_plan', write_only=True)

    class Meta: 
        model = Meal 
        fields = ['id', 'diet_plan', 'diet_plan_id', 'name', 'time', 'description', 'food_items', 'total_calories']