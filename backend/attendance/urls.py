from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from attendance.views import (
    AdminLoginView, TeacherView, ClassViewSet, AssignmentView,
    TeacherLoginView, StudentViewSet, AttendanceViewSet, TeacherSetPasswordView,TeacherLogoutView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r't28teachers', TeacherView, basename='teacher')
router.register(r'class', ClassViewSet)
router.register(r'assignments', AssignmentView, basename='assignment')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', AdminLoginView.as_view(), name='login'),
    path('teacher/login/', TeacherLoginView.as_view(), name='teacher-login'),
    path('teacher/set-password/', TeacherSetPasswordView.as_view(), name='teacher-set-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('teacher/logout/', TeacherLogoutView.as_view(), name='teacher-logout'),
]