from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from attendance.views import AdminLoginView,TeacherView,ClassViewSet,AssignmentView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'teacher', TeacherView)
router.register(r'class', ClassViewSet)
router.register(r'assignments', AssignmentView, basename='assignment')
urlpatterns = [
    path('', include(router.urls)),
    path('login/', AdminLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


from attendance.models import Admin

