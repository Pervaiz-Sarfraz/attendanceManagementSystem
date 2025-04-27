from rest_framework import serializers
from .models import Admin, Teacher,Class,Assignment,Student,Attendance
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['name', 'email', 'password', 'admin_role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return Admin.objects.create_user(**validated_data)

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'name', 'email']

from rest_framework import serializers
from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'code', 'schedule', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by']



class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'code', 'schedule']

class AssignmentSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())
    class_assign = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    class_name = serializers.CharField(source='class_assign.name', read_only=True)
    class_code = serializers.CharField(source='class_assign.code', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'teacher', 'class_assign', 'teacher_name', 'class_name', 'class_code', 'created_at']
        read_only_fields = ['created_at', 'teacher_name', 'class_name', 'class_code']

    def create(self, validated_data):
        teacher = validated_data.pop('teacher')
        class_assign = validated_data.pop('class_assign')
        assignment = Assignment.objects.create(
            teacher=teacher,
            class_assign=class_assign,
            created_by=self.context['request'].user  
        )
        return assignment

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation
    
class TeacherLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class TeacherSetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'