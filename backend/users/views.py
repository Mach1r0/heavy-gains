from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User 
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  
    
    def get_permissions(self):
        if self.action in ['create', 'list']:  
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        profile_picture = self.request.FILES.get('profile_picture')
        if profile_picture:
            serializer.save(profile_picture=profile_picture)
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        profile_picture = self.request.FILES.get('profile_picture')
        if profile_picture:
            serializer.save(profile_picture=profile_picture)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retorna dados do usuário logado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class LoginViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]

    def create(self, request): 
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Username e password são obrigatórios"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Credenciais inválidas"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)

        user_data = {
            'id': user.id, 
            'username': user.username, 
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_teacher': getattr(user, 'is_teacher', False),
            'is_student': getattr(user, 'is_student', False),
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
        }

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        }, status=status.HTTP_200_OK)