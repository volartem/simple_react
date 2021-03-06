from rest_framework import serializers
from courses.models import Course, Student


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(default=False)
    courses = serializers.SlugRelatedField(allow_null=True,
                                           many=True,
                                           slug_field="name",
                                           queryset=Course.objects.all())

    class Meta:
        model = Student
        fields = ("id", "email", "name", "surname", "status", "courses")


class StudentCreateSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(default=False)

    class Meta:
        model = Student
        fields = ("id", "email", "name", "surname", "status", "courses")
