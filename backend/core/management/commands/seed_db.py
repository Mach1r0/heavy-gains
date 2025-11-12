"""
Django Management Command to seed the database
Usage: python manage.py seed_db
"""

from django.core.management.base import BaseCommand
from datetime import datetime, timedelta, time
from django.utils import timezone
from decimal import Decimal

from users.models import User
from student.models import Student, ProgressLog, PhotosStudent
from teachers.models import Teacher, ScheduleTeacher, ScheduleException, Appointment, TeacherStudents
from exercises.models import Exercise
from training.models import Training, Workout, WorkoutExercise
from tracking.models import WorkoutSession, ExerciseLog, SetLog
from diet.models import FoodItem, DietPlan, Meal, MealFoodItem, MealRegistration
from analytics.models import PersonalRecord, BodyMeasurement, ProgressPhoto


class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('🗑️  Clearing database...'))
            self.clear_database()
            self.stdout.write(self.style.SUCCESS('✅ Database cleared!\n'))
        
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding...\n'))
        
        users = self.create_users()
        teacher_students = self.create_teacher_student_relationships()
        self.create_teacher_schedules()
        exercises = self.create_exercises()
        foods = self.create_food_items()
        trainings = self.create_training_plans()
        sessions = self.create_workout_sessions()
        diet_plans = self.create_diet_plans()
        progress_logs = self.create_progress_logs()
        measurements = self.create_body_measurements()
        appointments = self.create_appointments()
        
        self.stdout.write(self.style.SUCCESS("\n" + "="*50))
        self.stdout.write(self.style.SUCCESS("✨ Database seeding completed successfully!"))
        self.stdout.write(self.style.SUCCESS("="*50))
        self.stdout.write("\n📊 Summary:")
        self.stdout.write(f"   👥 Users: {len(users)}")
        self.stdout.write(f"   �‍🏫 Teacher-Student Relations: {len(teacher_students)}")
        self.stdout.write(f"   �💪 Exercises: {len(exercises)}")
        self.stdout.write(f"   🍎 Food Items: {len(foods)}")
        self.stdout.write(f"   🏋️ Training Plans: {len(trainings)}")
        self.stdout.write(f"   📊 Workout Sessions: {len(sessions)}")
        self.stdout.write(f"   🍽️ Diet Plans: {len(diet_plans)}")
        self.stdout.write(f"   📈 Progress Logs: {len(progress_logs)}")
        self.stdout.write(f"   📏 Body Measurements: {len(measurements)}")
        self.stdout.write(f"   📆 Appointments: {len(appointments)}")
        self.stdout.write("\n🔑 Test Credentials:")
        self.stdout.write("   Teacher: carlos_trainer / password123")
        self.stdout.write("   Teacher: ana_fitness / password123")
        self.stdout.write("   Student: joao_aluno / password123")
        self.stdout.write("   Student: maria_fitness / password123")
        self.stdout.write("   Student: pedro_gains / password123\n")

    def clear_database(self):
        """Clear all data from database"""
        SetLog.objects.all().delete()
        ExerciseLog.objects.all().delete()
        WorkoutSession.objects.all().delete()
        MealRegistration.objects.all().delete()
        MealFoodItem.objects.all().delete()
        Meal.objects.all().delete()
        DietPlan.objects.all().delete()
        FoodItem.objects.all().delete()
        WorkoutExercise.objects.all().delete()
        Workout.objects.all().delete()
        Training.objects.all().delete()
        PersonalRecord.objects.all().delete()
        BodyMeasurement.objects.all().delete()
        ProgressPhoto.objects.all().delete()
        ProgressLog.objects.all().delete()
        PhotosStudent.objects.all().delete()
        Appointment.objects.all().delete()
        ScheduleException.objects.all().delete()
        ScheduleTeacher.objects.all().delete()
        TeacherStudents.objects.all().delete()
        Student.objects.all().delete()
        Teacher.objects.all().delete()
        User.objects.all().delete()

    def create_users(self):
        """Create sample users"""
        self.stdout.write("👥 Creating users...")
        
        users = []
        
        # Teachers
        teacher1 = User.objects.create_user(
            username='carlos_trainer',
            email='carlos@heavygains.com',
            password='password123',
            first_name='Carlos',
            last_name='Silva',
            is_teacher=True
        )
        Teacher.objects.create(
            user=teacher1,
            feedback_score=4.8,
            bio='Personal trainer especializado em hipertrofia e perda de peso',
            specialties='Hipertrofia, Emagrecimento, Funcional',
            phone_number='+55 11 98765-4321',
            CREF='123456-G/SP'
        )
        users.append(teacher1)
        
        teacher2 = User.objects.create_user(
            username='ana_fitness',
            email='ana@heavygains.com',
            password='password123',
            first_name='Ana',
            last_name='Costa',
            is_teacher=True
        )
        Teacher.objects.create(
            user=teacher2,
            feedback_score=4.9,
            bio='Especialista em treino funcional e reabilitação',
            specialties='Funcional, Reabilitação, Mobilidade',
            phone_number='+55 11 98765-1234',
            CREF='654321-G/SP'
        )
        users.append(teacher2)
        
        # Students
        student1 = User.objects.create_user(
            username='joao_aluno',
            email='joao@example.com',
            password='password123',
            first_name='João',
            last_name='Oliveira',
            is_student=True
        )
        Student.objects.create(user=student1, age=25, phone_number='+55 11 91234-5678')
        users.append(student1)
        
        student2 = User.objects.create_user(
            username='maria_fitness',
            email='maria@example.com',
            password='password123',
            first_name='Maria',
            last_name='Santos',
            is_student=True
        )
        Student.objects.create(user=student2, age=28, phone_number='+55 11 91234-8765')
        users.append(student2)
        
        student3 = User.objects.create_user(
            username='pedro_gains',
            email='pedro@example.com',
            password='password123',
            first_name='Pedro',
            last_name='Almeida',
            is_student=True
        )
        Student.objects.create(user=student3, age=22, phone_number='+55 11 99876-5432')
        users.append(student3)
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(users)} users"))
        return users

    def create_teacher_student_relationships(self):
        """Create TeacherStudents relationships"""
        self.stdout.write("👨‍🏫 Creating teacher-student relationships...")
        
        teachers = Teacher.objects.all()
        students = Student.objects.all()
        
        relationships = []
        
        # Carlos (teacher1) gets all students
        teacher1 = teachers[0]
        for student in students:
            rel = TeacherStudents.objects.create(
                teacher=teacher1,
                student=student,
                is_active=True
            )
            relationships.append(rel)
        
        # Ana (teacher2) gets students 2 and 3
        if len(teachers) > 1 and len(students) >= 2:
            teacher2 = teachers[1]
            for student in students[1:]:
                rel = TeacherStudents.objects.create(
                    teacher=teacher2,
                    student=student,
                    is_active=True
                )
                relationships.append(rel)
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(relationships)} teacher-student relationships"))
        return relationships

    def create_teacher_schedules(self):
        """Create teacher schedules"""
        self.stdout.write("📅 Creating teacher schedules...")
        
        teachers = Teacher.objects.all()
        
        for teacher in teachers:
            for day in range(5):
                ScheduleTeacher.objects.create(
                    teacher=teacher, day_of_week=day,
                    start_time=time(6, 0), end_time=time(10, 0), is_available=True
                )
                ScheduleTeacher.objects.create(
                    teacher=teacher, day_of_week=day,
                    start_time=time(18, 0), end_time=time(22, 0), is_available=True
                )
            
            ScheduleTeacher.objects.create(
                teacher=teacher, day_of_week=5,
                start_time=time(8, 0), end_time=time(12, 0), is_available=True
            )
        
        self.stdout.write(self.style.SUCCESS("✅ Created teacher schedules"))

    def create_exercises(self):
        """Create sample exercises"""
        self.stdout.write("💪 Creating exercises...")
        
        exercises_data = [
            {'name': 'Supino Reto', 'description': 'Exercício composto para peito', 'muscle_group': 'Peito'},
            {'name': 'Supino Inclinado', 'description': 'Foca na parte superior do peito', 'muscle_group': 'Peito'},
            {'name': 'Crucifixo', 'description': 'Isolamento de peito', 'muscle_group': 'Peito'},
            {'name': 'Flexão', 'description': 'Exercício com peso corporal', 'muscle_group': 'Peito'},
            {'name': 'Barra Fixa', 'description': 'Exercício composto para costas', 'muscle_group': 'Costas'},
            {'name': 'Remada Curvada', 'description': 'Desenvolvimento das costas', 'muscle_group': 'Costas'},
            {'name': 'Remada Cavalinho', 'description': 'Remada com apoio', 'muscle_group': 'Costas'},
            {'name': 'Pulldown', 'description': 'Puxada frontal', 'muscle_group': 'Costas'},
            {'name': 'Agachamento Livre', 'description': 'Rei dos exercícios', 'muscle_group': 'Pernas'},
            {'name': 'Leg Press', 'description': 'Desenvolvimento de pernas', 'muscle_group': 'Pernas'},
            {'name': 'Cadeira Extensora', 'description': 'Isolamento de quadríceps', 'muscle_group': 'Pernas'},
            {'name': 'Mesa Flexora', 'description': 'Isolamento de posterior', 'muscle_group': 'Pernas'},
            {'name': 'Desenvolvimento Militar', 'description': 'Exercício composto para ombros', 'muscle_group': 'Ombros'},
            {'name': 'Elevação Lateral', 'description': 'Isolamento de ombro medial', 'muscle_group': 'Ombros'},
            {'name': 'Rosca Direta', 'description': 'Exercício para bíceps', 'muscle_group': 'Bíceps'},
            {'name': 'Rosca Martelo', 'description': 'Variação de rosca', 'muscle_group': 'Bíceps'},
            {'name': 'Tríceps Pulley', 'description': 'Isolamento de tríceps', 'muscle_group': 'Tríceps'},
            {'name': 'Tríceps Testa', 'description': 'Exercício para tríceps', 'muscle_group': 'Tríceps'},
            {'name': 'Abdominal Crunch', 'description': 'Exercício básico de core', 'muscle_group': 'Abdômen'},
            {'name': 'Prancha', 'description': 'Isometria de core', 'muscle_group': 'Abdômen'},
        ]
        
        exercises = [Exercise.objects.create(**data) for data in exercises_data]
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(exercises)} exercises"))
        return exercises

    def create_food_items(self):
        """Create sample food items"""
        self.stdout.write("🍎 Creating food items...")
        
        foods_data = [
            {'name': 'Peito de Frango', 'calories': 165, 'protein': 31, 'carbs': 0, 'fats': 3.6, 'category': 'PRN'},
            {'name': 'Ovo (unidade)', 'calories': 155, 'protein': 13, 'carbs': 1.1, 'fats': 11, 'category': 'PRN'},
            {'name': 'Tilápia', 'calories': 96, 'protein': 20, 'carbs': 0, 'fats': 1.7, 'category': 'PRN'},
            {'name': 'Whey Protein', 'calories': 120, 'protein': 24, 'carbs': 3, 'fats': 1.5, 'category': 'PRN'},
            {'name': 'Arroz Branco', 'calories': 130, 'protein': 2.7, 'carbs': 28, 'fats': 0.3, 'category': 'GRN'},
            {'name': 'Batata Doce', 'calories': 86, 'protein': 1.6, 'carbs': 20, 'fats': 0.1, 'category': 'GRN'},
            {'name': 'Aveia', 'calories': 389, 'protein': 17, 'carbs': 66, 'fats': 7, 'category': 'GRN'},
            {'name': 'Brócolis', 'calories': 34, 'protein': 2.8, 'carbs': 7, 'fats': 0.4, 'category': 'VEG'},
            {'name': 'Alface', 'calories': 15, 'protein': 1.4, 'carbs': 2.9, 'fats': 0.2, 'category': 'VEG'},
            {'name': 'Banana', 'calories': 89, 'protein': 1.1, 'carbs': 23, 'fats': 0.3, 'category': 'FRT'},
            {'name': 'Maçã', 'calories': 52, 'protein': 0.3, 'carbs': 14, 'fats': 0.2, 'category': 'FRT'},
            {'name': 'Azeite de Oliva', 'calories': 884, 'protein': 0, 'carbs': 0, 'fats': 100, 'category': 'FAT'},
        ]
        
        foods = [FoodItem.objects.create(**data) for data in foods_data]
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(foods)} food items"))
        return foods

    def create_training_plans(self):
        """Create training plans with workouts for all teacher-student relationships"""
        self.stdout.write("🏋️ Creating training plans...")
        
        teachers = Teacher.objects.all()
        trainings = []
        
        # Create training plans for each teacher's students
        for teacher in teachers:
            teacher_students = TeacherStudents.objects.filter(teacher=teacher, is_active=True)
            
            for ts in teacher_students:
                student = ts.student
                
                # Create a training plan
                training = Training.objects.create(
                    student=student,
                    teacher=teacher,
                    goal='HYP' if trainings.__len__() % 2 == 0 else 'STR',
                    name=f'Treino {student.user.first_name} - ABC',
                    description=f'Treino personalizado para {student.user.first_name}',
                    is_active=True
                )
                trainings.append(training)
                
                # Workout A - Chest & Triceps
                workout_a = Workout.objects.create(
                    training_plan=training,
                    name='Treino A - Peito e Tríceps',
                    day_of_week='1'
                )
                
                chest_ex = list(Exercise.objects.filter(muscle_group='Peito')[:3])
                triceps_ex = list(Exercise.objects.filter(muscle_group='Tríceps')[:2])
                
                for ex in chest_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_a,
                        exercise=ex,
                        sets=4,
                        reps=12,
                        rest_time=timedelta(seconds=90)
                    )
                
                for ex in triceps_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_a,
                        exercise=ex,
                        sets=3,
                        reps=15,
                        rest_time=timedelta(seconds=60)
                    )
                
                # Workout B - Back & Biceps
                workout_b = Workout.objects.create(
                    training_plan=training,
                    name='Treino B - Costas e Bíceps',
                    day_of_week='3'
                )
                
                back_ex = list(Exercise.objects.filter(muscle_group='Costas')[:3])
                biceps_ex = list(Exercise.objects.filter(muscle_group='Bíceps')[:2])
                
                for ex in back_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_b,
                        exercise=ex,
                        sets=4,
                        reps=10,
                        rest_time=timedelta(seconds=90)
                    )
                
                for ex in biceps_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_b,
                        exercise=ex,
                        sets=3,
                        reps=12,
                        rest_time=timedelta(seconds=60)
                    )
                
                # Workout C - Legs & Shoulders
                workout_c = Workout.objects.create(
                    training_plan=training,
                    name='Treino C - Pernas e Ombros',
                    day_of_week='5'
                )
                
                leg_ex = list(Exercise.objects.filter(muscle_group='Pernas')[:4])
                shoulder_ex = list(Exercise.objects.filter(muscle_group='Ombros')[:2])
                
                for ex in leg_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_c,
                        exercise=ex,
                        sets=4,
                        reps=12,
                        rest_time=timedelta(seconds=120)
                    )
                
                for ex in shoulder_ex:
                    WorkoutExercise.objects.create(
                        workout=workout_c,
                        exercise=ex,
                        sets=3,
                        reps=15,
                        rest_time=timedelta(seconds=60)
                    )
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(trainings)} training plans"))
        return trainings

    def create_workout_sessions(self):
        """Create workout session logs"""
        self.stdout.write("📊 Creating workout sessions...")
        
        students = Student.objects.all()
        today = timezone.now().date()
        
        sessions = []
        
        for student in students[:2]:
            training = Training.objects.filter(student=student).first()
            if not training:
                continue
            
            workouts = Workout.objects.filter(training_plan=training)
            
            for week in range(6):
                for workout in workouts:
                    date = today - timedelta(weeks=week, days=int(workout.day_of_week))
                    
                    session = WorkoutSession.objects.create(
                        user=student.user, workout=workout, date=date, status='CMP',
                        started_at=timezone.make_aware(datetime.combine(date, time(7, 0))),
                        ended_at=timezone.make_aware(datetime.combine(date, time(8, 30)))
                    )
                    sessions.append(session)
                    
                    workout_exercises = WorkoutExercise.objects.filter(workout=workout)
                    for idx, we in enumerate(workout_exercises):
                        exercise_log = ExerciseLog.objects.create(
                            session=session, exercise=we.exercise,
                            workout_exercise=we, order=idx
                        )
                        
                        for set_num in range(1, we.sets + 1):
                            SetLog.objects.create(
                                exercise_log=exercise_log, set_number=set_num,
                                repetitions=we.reps, weight=50.0 + (week * 2.5),
                                rest_time=we.rest_time, set_type='WORK'
                            )
        
        # Today's planned session
        for student in students[:2]:
            training = Training.objects.filter(student=student).first()
            if training:
                workout = Workout.objects.filter(training_plan=training).first()
                if workout:
                    sessions.append(WorkoutSession.objects.create(
                        user=student.user, workout=workout, date=today, status='PLN'
                    ))
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(sessions)} workout sessions"))
        return sessions

    def create_diet_plans(self):
        """Create diet plans with meals for all teacher-student relationships"""
        self.stdout.write("🍽️ Creating diet plans...")
        
        teachers = Teacher.objects.all()
        diet_plans = []
        
        # Create diet plans for each teacher's students
        for teacher in teachers:
            teacher_students = TeacherStudents.objects.filter(teacher=teacher, is_active=True)
            
            for idx, ts in enumerate(teacher_students):
                student = ts.student
                
                diet_plan = DietPlan.objects.create(
                    student=student.user,
                    teacher=teacher.user,
                    name=f'Dieta {student.user.first_name}',
                    goal='CUT' if idx % 3 == 0 else 'BUK' if idx % 3 == 1 else 'MAINT',
                    start_date=timezone.now().date() - timedelta(days=30),
                    end_date=timezone.now().date() + timedelta(days=60),
                    description=f'Plano alimentar personalizado para {student.user.first_name}',
                    target_calories=2000 + (idx * 200),
                    is_active=True
                )
                diet_plans.append(diet_plan)
                
                # Breakfast
                breakfast = Meal.objects.create(
                    diet_plan=diet_plan,
                    name='Café da Manhã',
                    time=time(7, 0),
                    description='Primeira refeição do dia'
                )
                
                oats = FoodItem.objects.filter(name='Aveia').first()
                banana = FoodItem.objects.filter(name='Banana').first()
                egg = FoodItem.objects.filter(name='Ovo (unidade)').first()
                
                if oats:
                    MealFoodItem.objects.create(meal=breakfast, food_item=oats, quantity=50, unit='g')
                if banana:
                    MealFoodItem.objects.create(meal=breakfast, food_item=banana, quantity=100, unit='g')
                if egg:
                    MealFoodItem.objects.create(meal=breakfast, food_item=egg, quantity=2, unit='unit')
                
                # Lunch
                lunch = Meal.objects.create(
                    diet_plan=diet_plan,
                    name='Almoço',
                    time=time(12, 0),
                    description='Refeição principal'
                )
                
                chicken = FoodItem.objects.filter(name='Peito de Frango').first()
                rice = FoodItem.objects.filter(name='Arroz Branco').first()
                broccoli = FoodItem.objects.filter(name='Brócolis').first()
                
                if chicken:
                    MealFoodItem.objects.create(meal=lunch, food_item=chicken, quantity=150, unit='g')
                if rice:
                    MealFoodItem.objects.create(meal=lunch, food_item=rice, quantity=100, unit='g')
                if broccoli:
                    MealFoodItem.objects.create(meal=lunch, food_item=broccoli, quantity=100, unit='g')
                
                # Snack
                snack = Meal.objects.create(
                    diet_plan=diet_plan,
                    name='Lanche da Tarde',
                    time=time(15, 30),
                    description='Lanche intermediário'
                )
                
                whey = FoodItem.objects.filter(name='Whey Protein').first()
                sweet_potato = FoodItem.objects.filter(name='Batata Doce').first()
                
                if whey:
                    MealFoodItem.objects.create(meal=snack, food_item=whey, quantity=30, unit='g')
                if sweet_potato:
                    MealFoodItem.objects.create(meal=snack, food_item=sweet_potato, quantity=150, unit='g')
                
                # Dinner
                dinner = Meal.objects.create(
                    diet_plan=diet_plan,
                    name='Jantar',
                    time=time(19, 0),
                    description='Última refeição principal'
                )
                
                fish = FoodItem.objects.filter(name='Tilápia').first()
                lettuce = FoodItem.objects.filter(name='Alface').first()
                
                if fish:
                    MealFoodItem.objects.create(meal=dinner, food_item=fish, quantity=180, unit='g')
                if rice:
                    MealFoodItem.objects.create(meal=dinner, food_item=rice, quantity=80, unit='g')
                if lettuce:
                    MealFoodItem.objects.create(meal=dinner, food_item=lettuce, quantity=50, unit='g')
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(diet_plans)} diet plans"))
        return diet_plans

    def create_progress_logs(self):
        """Create progress logs"""
        self.stdout.write("📈 Creating progress logs...")
        
        students = Student.objects.all()
        today = timezone.now().date()
        
        logs = []
        
        for student in students[:2]:
            start_weight = 85.0
            goal_weight = 75.0
            
            for week in range(6):
                date = today - timedelta(weeks=5-week)
                current_weight = start_weight - (week * 1.5)
                
                log = ProgressLog.objects.create(
                    student=student, date=date,
                    start_weight=start_weight, current_weight=current_weight,
                    goal_weight=goal_weight, imc=current_weight / (1.75 ** 2),
                    body_fat_percentage=20.0 - (week * 0.5),
                    notes=f'Semana {week + 1} - Progresso consistente'
                )
                logs.append(log)
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(logs)} progress logs"))
        return logs

    def create_body_measurements(self):
        """Create body measurements"""
        self.stdout.write("📏 Creating body measurements...")
        
        students = Student.objects.all()
        today = timezone.now().date()
        
        measurements = []
        
        for student in students[:2]:
            for week in range(6):
                date = today - timedelta(weeks=5-week)
                
                measurement = BodyMeasurement.objects.create(
                    user=student.user, date=date,
                    weight_kg=85.0 - (week * 1.5),
                    body_fat_percent=20.0 - (week * 0.5),
                    muscle_mass_kg=65.0 + (week * 0.3),
                    chest_cm=100.0 - (week * 0.5),
                    waist_cm=85.0 - (week * 1.0),
                    notes=f'Medição semana {week + 1}'
                )
                measurements.append(measurement)
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(measurements)} measurements"))
        return measurements

    def create_appointments(self):
        """Create appointments"""
        self.stdout.write("📆 Creating appointments...")
        
        students = Student.objects.all()
        teachers = Teacher.objects.all()
        today = timezone.now().date()
        
        appointments = []
        
        for i in range(5):
            date = today + timedelta(days=i)
            student = students[i % len(students)]
            teacher = teachers[i % len(teachers)]
            
            appointment = Appointment.objects.create(
                teacher=teacher, student=student, date=date,
                start_time=time(9, 0), end_time=time(10, 0),
                status='confirmed' if i < 3 else 'pending',
                notes='Consulta de acompanhamento'
            )
            appointments.append(appointment)
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(appointments)} appointments"))
        return appointments
