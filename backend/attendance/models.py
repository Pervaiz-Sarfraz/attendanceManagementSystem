from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password,check_password
from django.db import models

class AdminManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("admin_role", "superadmin")
        return self.create_user(email, password, **extra_fields)

class Admin(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    admin_role = models.CharField(max_length=100, default="admin")
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = AdminManager()

    def __str__(self):
        return self.email
    
class Teacher(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    is_first_login = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name="teachers")

    def __str__(self):
        return self.name

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    
class Class(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10,unique=True)
    schedule = models.CharField(max_length=100)    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name="classes")
    def __str__(self):
        return self.name

    
class Assignment(models.Model):
    teacher = models.ForeignKey(Teacher,    on_delete=models.CASCADE, related_name="assignments")
    class_assign = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="assignments")  
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name="assignments")

    class Meta:
        unique_together = ('teacher', 'class_assign')  

    def __str__(self):
        return f"{self.teacher.name} assigned to {self.class_assign.name}"


class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    class_enrolled = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="students")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Attendance(models.Model):
    class_attended = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="attendances")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('present', 'Present'), ('absent', 'Absent')])
    marked_by = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="marked_attendances")
    marked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.name} - {self.date} - {self.status}"

