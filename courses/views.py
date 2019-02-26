from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from courses.models import Course, Student
from courses.serializers import CourseSerializer, StudentSerializer, StudentCreateSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import FieldError
from rest_framework.exceptions import ParseError


class BaseModelViewSetMixin(ModelViewSet):
    model_class = None
    filter_backends = (filters.SearchFilter, DjangoFilterBackend,)

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, *args, **kwargs):
        """
        Get list items with ordering, search and model fields params for filtering
        """
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def destroy(self, request, *args, **kwargs):
        super().destroy(self, request, *args, **kwargs)
        data = self.custom_data()
        return Response(status=status.HTTP_200_OK, data=data)

    def create(self, request, *args, **kwargs):
        if self.model_class == Student:
            serializer = StudentCreateSerializer(data=request.data)
        else:
            serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.custom_data()
        data["item"] = serializer.data
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def custom_data(self):
        ordering = self.request.query_params.get('ordering', "id")
        try:
            queryset = self.model_class.objects.all().order_by(ordering)
            filter_queryset = self.filter_queryset(queryset)
            if self.model_class == Student and (ordering == "courses" or ordering == "-courses"):
                filter_queryset = Student.objects.raw(
                    "SELECT * FROM (SELECT DISTINCT ON(courses_student.id) courses_course.name cc_name, * "
                    "FROM courses_student "
                    "LEFT JOIN courses_student_courses ON courses_student.id = courses_student_courses.student_id "
                    "LEFT JOIN courses_course ON courses_student_courses.course_id = courses_course.id) t "
                    "ORDER BY t.cc_name {}" .format("DESC" if ordering == "-courses" else "ASC"))
            paginate_queryset = self.paginate_queryset(filter_queryset)
        except FieldError:
            raise ParseError

        total_items = len(list(filter_queryset))
        serializer = self.serializer_class(paginate_queryset, many=True)
        related = []
        if self.model_class == Student:
            related = CourseSerializer(Course.objects.all(), many=True).data
        data = {"total": total_items, "related": related, "result": serializer.data}
        return data


class CourseViewSet(BaseModelViewSetMixin):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Course model.
    """

    model_class = Course
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    search_fields = ("name", "description", "short_description",)
    filter_fields = ("id", "name", "description", "short_description", "code",)


class StudentViewSet(BaseModelViewSetMixin):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Student model.
    """
    model_class = Student
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ("name", "surname", "email",)
    filter_fields = ("id", "name", "surname", "email", "courses", "status",)
