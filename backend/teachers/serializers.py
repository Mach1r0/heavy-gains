from student.serializers import StudentSerializer
from rest_framework import serializers
from .models import Appointment, Teacher, TeacherStudents
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
    
class ScheduleTeacherSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'teacher', 'day_of_week', 'start_time', 'end_time',
            'is_available'
         ]
        read_only_fields = ['id', 'teacher']

class ScheduleExceptionSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'teacher', 'date', 'is_available', 'reason',
            'start_time', 'end_time'
         ]
        read_only_fields = ['id', 'teacher']

class AppointmentSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'teacher', 'student', 'date', 'start_time', 'end_time', 'status', 'notes',
            'created_at', 'updated_at'
         ]
        read_only_fields = ['id', 'teacher', 'student', 'created_at', 'updated_at']

class TeacherStudentsSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.IntegerField(source='student.id', read_only=True)
    student_name = serializers.SerializerMethodField()
    student_user_id = serializers.IntegerField(source='student.user.id', read_only=True)
    is_evaluated = serializers.SerializerMethodField()  
    evaluation_status = serializers.SerializerMethodField()  

    class Meta:
        model = TeacherStudents
        fields = [
            'id', 'student', 'student_id', 'student_name', 
            'student_user_id', 'assigned_at', 'is_active',
            'is_evaluated', 'evaluation_status'  
        ]
        read_only_fields = ['id', 'assigned_at']
    
    def get_student_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}"
    
    def get_is_evaluated(self, obj):
        return obj.is_fully_evaluated()
    
    def get_evaluation_status(self, obj):
        return obj.get_evaluation_status()