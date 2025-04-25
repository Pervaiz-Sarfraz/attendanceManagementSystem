# attendance/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import TeacherSerializer,ClassSerializer,AssignmentSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Admin, Teacher,Class,Assignment
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin

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