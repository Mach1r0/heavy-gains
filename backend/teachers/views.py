from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .serializers import TeacherSerializer, TeacherStudentsSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Teacher, TeacherStudents
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        teacher = serializer.save()

        return Response({
            'message': 'Conta criada com sucesso! Faça login para continuar.',
            'teacher': TeacherSerializer(teacher).data,
            'user_type': 'teacher'
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture:
            serializer.save(profile_picture=profile_picture)
        else:
            serializer.save()
        return Response(serializer.data)
    
class TeacherStudentView(viewsets.ModelViewSet):
    queryset = TeacherStudents.objects.all()
    serializer_class = TeacherStudentsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_teacher(self, request):
        return Teacher.objects.get(user=request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_active_students(self, request, *args, **kwargs):
        teacher = self.get_teacher(request)
        students = TeacherStudents.objects.filter(teacher=teacher, is_active=True)
        serializer = TeacherStudentsSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_all_students(self, request, *args, **kwargs):
        teacher = self.get_teacher(request)
        students = TeacherStudents.objects.filter(teacher=teacher)
        serializer = TeacherStudentsSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_deactivated_students(self, request, *args, **kwargs):
        teacher = self.get_teacher(request)
        students = TeacherStudents.objects.filter(teacher=teacher, is_active=False)
        serializer = TeacherStudentsSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_evaluated_students(self, request, *args, **kwargs):
        teacher = self.get_teacher(request)
        students = TeacherStudents.objects.filter(teacher=teacher, is_active=True)
        
        evaluated = [s for s in students if s.is_fully_evaluated()]
        
        serializer = TeacherStudentsSerializer(evaluated, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_pending_evaluation_students(self, request, *args, **kwargs):
        teacher = self.get_teacher(request)
        students = TeacherStudents.objects.filter(teacher=teacher, is_active=True)
        
        pending = [s for s in students if not s.is_fully_evaluated()]
        
        serializer = TeacherStudentsSerializer(pending, many=True)
        return Response(serializer.data)