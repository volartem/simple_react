from rest_framework.viewsets import ModelViewSet
from courses.models import Course, Student
from courses.serializers import CourseSerializer, StudentSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response


class CourseViewSet(ModelViewSet):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Course model.
    """
    queryset = Course.objects.all().order_by("id")
    serializer_class = CourseSerializer

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, *args, **kwargs):
        queryset = Course.objects.all().order_by("id")
        serializer = CourseSerializer(queryset, many=True)
        return Response({"result": serializer.data, "related": []})


class StudentViewSet(ModelViewSet):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Student model.
    """
    queryset = Student.objects.all().order_by("id")
    serializer_class = StudentSerializer

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, *args, **kwargs):
        queryset = Student.objects.all().order_by("id")
        serializer = StudentSerializer(queryset, many=True)
        data = {"related": CourseSerializer(Course.objects.all(), many=True).data, "result": serializer.data}
        return Response(data)
