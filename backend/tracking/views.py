from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework import permissions

class WorkoutSessionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSession.objects.all()
    serializer_class = WorkoutSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExerciseLogViewSet(viewsets.ModelViewSet):
    queryset = ExerciseLog.objects.all()
    serializer_class = ExerciseLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def exercise_pr(self, request):
        user = request.user
        exercise_id = request.query_params.get('exercise_id')
        
        if not exercise_id:
            return Response({"error": "exercise_id parameter is required"}, status=400)

        prs = SetLog.objects.filter(
            exercise_log__session__user=user,
            exercise_log__exercise_id=exercise_id, 
            set_type='WORK'
        ).select_related(
            'exercise_log',           
            'exercise_log__exercise',    
            'exercise_log__session'  
        ).order_by('-weight').first()
        
        return Response({"pr": prs})

    def calculate_1rm(self, weight, reps):
        if reps > 1:
            return weight * (1 + reps / 30.0)
        return weight

class SetLogViewSet(viewsets.ModelViewSet):
    queryset = SetLog.objects.all()
    serializer_class = SetLogSerializer
    permission_classes = [permissions.IsAuthenticated]


