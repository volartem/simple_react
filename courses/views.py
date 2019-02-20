from rest_framework.viewsets import ModelViewSet
from rest_framework import status
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
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def destroy(self, request, *args, **kwargs):
        super().destroy(self, request, *args, **kwargs)
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.custom_data()
        data["item"] = serializer.data
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def custom_data(self):
        queryset = Course.objects.all().order_by("id")
        total_items = queryset.count()
        paginate_queryset = self.paginate_queryset(queryset)
        serializer = CourseSerializer(paginate_queryset, many=True)
        data = {"total": total_items, "related": [], "result": serializer.data}
        return data


class StudentViewSet(ModelViewSet):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Student model.
    """
    queryset = Student.objects.all().order_by("id")
    serializer_class = StudentSerializer

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, *args, **kwargs):
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def destroy(self, request, *args, **kwargs):
        super().destroy(self, request, *args, **kwargs)
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.custom_data()
        data["item"] = serializer.data
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def custom_data(self):
        queryset = Student.objects.all().order_by("id")
        total_items = queryset.count()
        paginate_queryset = self.paginate_queryset(queryset)
        serializer = StudentSerializer(paginate_queryset, many=True)
        data = {"total": total_items, "related": CourseSerializer(Course.objects.all(), many=True).data,
                "result": serializer.data}
        return data
