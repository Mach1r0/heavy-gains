from rest_framework import serializers
from .models import Student
from users.models import User

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    user_data = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'age', 'weight', 'height', 'created_at', 'updated_at', 'user_data'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'age': {'required': False, 'allow_null': True},
            'weight': {'required': False, 'allow_null': True},
            'height': {'required': False, 'allow_null': True},
        }
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este username já está em uso.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value
    
    def get_user_data(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'profile_picture': obj.user.profile_picture.url if obj.user.profile_picture else None,
        }
    
    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
        }
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            **user_data,
            password=password,
            is_student=True
        )
        
        student = Student.objects.create(user=user, **validated_data)
        return student
    
    def update(self, instance, validated_data):
        instance.age = validated_data.get('age', instance.age)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.height = validated_data.get('height', instance.height)
        instance.save()
        return instance