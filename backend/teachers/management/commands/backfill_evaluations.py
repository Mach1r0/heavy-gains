from django.core.management.base import BaseCommand
from django.utils import timezone
from teachers.models import TeacherStudents, StudentEvaluation
from diet.models import DietPlan
from training.models import Training
from analytics.models import ProgressPhoto, BodyMeasurement


class Command(BaseCommand):
    help = 'Backfill StudentEvaluation records based on existing data'

    def handle(self, *args, **options):
        self.stdout.write('Starting backfill of StudentEvaluation records...\n')
        
        # Get all TeacherStudents relationships
        teacher_students = TeacherStudents.objects.all()
        created_count = 0
        updated_count = 0
        
        for ts in teacher_students:
            self.stdout.write(f'\nProcessing: {ts.student.user.username}')
            
            # Create or get StudentEvaluation
            evaluation, created = StudentEvaluation.objects.get_or_create(
                teacher_student=ts
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  Created StudentEvaluation'))
            
            # Check for diet plans
            has_diet = DietPlan.objects.filter(student=ts.student.user).exists()
            if has_diet and not evaluation.has_diet_plan:
                evaluation.has_diet_plan = True
                evaluation.diet_plan_date = timezone.now()
                self.stdout.write(f'  ✓ Found diet plan')
            
            # Check for trainings
            has_training = Training.objects.filter(student=ts.student).exists()
            if has_training and not evaluation.has_training_plan:
                evaluation.has_training_plan = True
                evaluation.training_plan_date = timezone.now()
                self.stdout.write(f'  ✓ Found training plan')
            
            # Check for photos
            has_photos = ProgressPhoto.objects.filter(user=ts.student.user).exists()
            if has_photos and not evaluation.has_initial_photos:
                evaluation.has_initial_photos = True
                evaluation.initial_photos_date = timezone.now()
                self.stdout.write(f'  ✓ Found photos')
            
            # Check for measurements
            has_measurements = BodyMeasurement.objects.filter(user=ts.student.user).exists()
            if has_measurements and not evaluation.has_body_measurements:
                evaluation.has_body_measurements = True
                evaluation.body_measurements_date = timezone.now()
                self.stdout.write(f'  ✓ Found measurements')
            
            evaluation.save()
            updated_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'\n\nBackfill complete!'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} records'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} records'))
