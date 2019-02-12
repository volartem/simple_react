from rest_framework.routers import SimpleRouter
from courses.views import CourseViewSet, StudentViewSet

router = SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = router.urls
