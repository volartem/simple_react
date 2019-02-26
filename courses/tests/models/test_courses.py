from django.test import TestCase
from courses.models import Course


class CourseTest(TestCase):
    fixtures = [
        "initial.json",
    ]

    def test_name_content(self):
        course = Course.objects.get(pk=1)
        self.assertEquals(course.name, 'Programming')

    def test_description_content(self):
        course = Course.objects.get(pk=2)
        self.assertEquals(course.description, 'All tips and tricks of python language')

    def test_short_description_content(self):
        course = Course.objects.get(pk=3)
        self.assertEquals(course.short_description, 'Python for everyone')

    def test_code_content(self):
        course = Course.objects.get(pk=4)
        self.assertEquals(course.code, 'byte code')

    def test_edit_content(self):
        course = Course.objects.get(pk=4)
        course.code = "Edited code"
        course.name = "Edited name"
        course.save()
        edited_course = Course.objects.get(pk=4)
        self.assertEquals(edited_course.code, "Edited code")
        self.assertEquals(edited_course.name,  "Edited name")
