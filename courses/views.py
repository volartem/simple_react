from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from courses.models import Course, Student
from courses.serializers import CourseSerializer, StudentSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


class BaseModelViewSetMixin(ModelViewSet):
    model_class = None
    filter_backends = (filters.SearchFilter, DjangoFilterBackend,)
    ordering_filter = filters.OrderingFilter()

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
        queryset = self.model_class.objects.all().order_by("id")
        filter_queryset = self.filter_queryset(queryset)
        total_items = filter_queryset.count()
        paginate_queryset = self.paginate_queryset(filter_queryset)
        serializer = self.serializer_class(paginate_queryset, many=True)
        related = []
        if self.model_class == Student:
            related = CourseSerializer(Course.objects.all(), many=True).data
        data = {"total": total_items, "related": related, "result": serializer.data}
        return data

    def filter_queryset(self, queryset):
        queryset = super(BaseModelViewSetMixin, self).filter_queryset(queryset)
        return self.ordering_filter.filter_queryset(self.request, queryset, self)


class CourseViewSet(BaseModelViewSetMixin):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Course model.
    """

    model_class = Course
    queryset = Course.objects.all().order_by("id")
    serializer_class = CourseSerializer
    search_fields = ('name', 'short_description', "description",)
    filter_fields = ('name', "code",)


class StudentViewSet(BaseModelViewSetMixin):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions by Student model.
    """
    model_class = Student
    queryset = Student.objects.all().order_by("id")
    serializer_class = StudentSerializer
    search_fields = ('name', 'surname', "email",)
    filter_fields = ('name', "surname", "email",)
