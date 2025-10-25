from rest_framework import serializers
from .models import Teacher
from users.models import User

class TeacherSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    specialization = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    user_data = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'specialization', 'bio', 'specialties', 'feedback_score',
            'date_joined', 'updated_at', 'user_data'
        ]
        read_only_fields = ['id', 'feedback_score', 'date_joined', 'updated_at']
        extra_kwargs = {
            'bio': {'required': False, 'allow_null': True, 'allow_blank': True},
            'specialties': {'required': False, 'allow_null': True, 'allow_blank': True},
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
            'is_teacher': obj.user.is_teacher,
            'is_student': obj.user.is_student,
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
        
        # Remove specialization do validated_data se existir (não está no model Teacher)
        specialization = validated_data.pop('specialization', '')
        if specialization:
            validated_data['specialties'] = specialization
        
        user = User.objects.create_user(
            **user_data,
            password=password,
            is_teacher=True
        )
        
        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher
    
    def update(self, instance, validated_data):
        instance.bio = validated_data.get('bio', instance.bio)
        instance.specialties = validated_data.get('specialties', instance.specialties)
        instance.save()
        return instance