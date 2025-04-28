from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import (
    TeacherSerializer, ClassSerializer, AssignmentSerializer,
    TeacherLoginSerializer, TeacherSetPasswordSerializer, StudentSerializer, AttendanceSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Admin, Teacher, Class, Assignment, Student, Attendance
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

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
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = TeacherLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        teacher = serializer.validated_data['teacher']
        if teacher.is_first_login:
            return Response({
                "is_first_login": True,
                "message": "Please set your password",
                "teacher_id": teacher.id,
                "email": teacher.email,
                "name": teacher.name
            }, status=status.HTTP_200_OK)

        password = request.data.get("password")
        if not teacher.check_password(password):
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken()
        refresh['teacher_id'] = teacher.id
        refresh['email'] = teacher.email
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "teacher_id": teacher.id,
            "email": teacher.email,
            "name": teacher.name,
            "is_first_login": teacher.is_first_login
        }, status=status.HTTP_200_OK)

class TeacherSetPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = TeacherSetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        teacher = serializer.validated_data['teacher']
        teacher.set_password(serializer.validated_data['password'])
        teacher.is_first_login = False
        teacher.save()

        refresh = RefreshToken()
        refresh['teacher_id'] = teacher.id
        refresh['email'] = teacher.email
        return Response({
            "message": "Password set successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "teacher_id": teacher.id,
            "email": teacher.email,
            "name": teacher.name,
            "is_first_login": teacher.is_first_login
        }, status=status.HTTP_200_OK)

class TeacherLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  

            return Response({
                "message": "Logout successful. Token invalidated."
            }, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class TeacherTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh_token = serializer.validated_data['refresh']
            token = RefreshToken(refresh_token)

            teacher_id = token.get('teacher_id')
            email = token.get('email')
            if not teacher_id or not email:
                return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                teacher = Teacher.objects.get(id=teacher_id, email=email)
            except Teacher.DoesNotExist:
                return Response({"error": "Teacher not found"}, status=status.HTTP_400_BAD_REQUEST)
            new_refresh = RefreshToken()
            new_refresh['teacher_id'] = teacher.id
            new_refresh['email'] = teacher.email

            return Response({
                "access": str(new_refresh.access_token),
                "refresh": str(new_refresh)  
            }, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.request.user.get('teacher_id')
        if not teacher_id:
            return Student.objects.none()
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Student.objects.none()
        assigned_classes = Assignment.objects.filter(teacher=teacher).values_list('class_assign', flat=True)
        return Student.objects.filter(class_enrolled__in=assigned_classes)

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.request.user.get('teacher_id')
        if not teacher_id:
            return Attendance.objects.none()
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Attendance.objects.none()
        assigned_classes = Assignment.objects.filter(teacher=teacher).values_list('class_assign', flat=True)
        return Attendance.objects.filter(class_attended__in=assigned_classes)

    def perform_create(self, serializer):
        teacher_id = self.request.user.get('teacher_id')
        teacher = Teacher.objects.get(id=teacher_id)
        serializer.save(marked_by=teacher)