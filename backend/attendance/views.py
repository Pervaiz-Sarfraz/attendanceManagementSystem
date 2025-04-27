# attendance/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import TeacherSerializer,ClassSerializer,AssignmentSerializer,TeacherSetPasswordSerializer,StudentSerializer,AttendanceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Admin, Teacher,Class,Assignment,Student
from rest_framework.permissions import IsAuthenticated,AllowAny
from .permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes, authentication_classes

class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        admin = Admin.objects.filter(email=email).first()
        if not admin:
            return Response({"error": "Invalid email"}, status=status.HTTP_401_UNAUTHORIZED)
        if not admin.check_password(password):
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        if not admin.is_active:
            return Response({"error": "Account is inactive"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(admin)
        return Response({
            "message": "Login successful",
            "admin_id": admin.id,
            "email": admin.email,
            "name": admin.name,
            "role": admin.admin_role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

class TeacherView(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AssignmentView(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user) 
class TeacherLoginView(APIView):
    permission_classes = [AllowAny]      # ✅ Important
    authentication_classes = []          # ✅ Important

    def post(self, request):
        email = request.data.get("email")
        teacher = Teacher.objects.filter(email=email).first()

        if not teacher:
            return Response({"error": "Teacher not found. Please contact admin."}, status=status.HTTP_404_NOT_FOUND)

        if teacher.is_first_login:
            return Response({
                "is_first_login": True,
                "message": "Please set your password"
            }, status=status.HTTP_200_OK)

        password = request.data.get("password")
        if not teacher.check_password(password):
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(teacher)
        return Response({
            "message": "Login successful",
            "teacher_id": teacher.id,
            "email": teacher.email,
            "name": teacher.name,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)
    
class TeacherSetPasswordView(APIView):
    def post(self, request):
        serializer = TeacherSetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = request.data.get("email")
        teacher = Teacher.objects.filter(email=email).first()
        
        if not teacher:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not teacher.is_first_login:
            return Response({"error": "Password already set"}, status=status.HTTP_400_BAD_REQUEST)
        
        teacher.set_password(serializer.validated_data['password'])
        teacher.is_first_login = False
        teacher.save()
        
        return Response({"message": "Password set successfully"}, status=status.HTTP_200_OK)

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Teachers can only see students in classes they're assigned to
        teacher = self.request.user
        assigned_classes = Assignment.objects.filter(teacher=teacher).values_list('class_assign', flat=True)
        return Student.objects.filter(class_enrolled__in=assigned_classes)
    

    
class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Teachers can only see attendance for classes they're assigned to
        teacher = self.request.user
        assigned_classes = Assignment.objects.filter(teacher=teacher).values_list('class_assign', flat=True)
        return Attendance.objects.filter(class_attended__in=assigned_classes)

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)