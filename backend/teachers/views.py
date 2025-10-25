from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import TeacherSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Teacher
from rest_framework import permissions

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

        refresh = RefreshToken.for_user(teacher.user)

        return Response({
            'teacher': TeacherSerializer(teacher).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
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