from django.test import TestCase
from courses.models import Course


class CourseTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Course.objects.create(name='Test name1', description='Test description1',
                              short_description="Test short description1", code="Test code1")
        Course.objects.create(name='Test name2', description='Test description2',
                              short_description="Test short description2", code="Test code2")
        Course.objects.create(name='Test name3', description='Test description3',
                              short_description="Test short description3", code="Test code3")
        Course.objects.create(name='Test name4', description='Test description4',
                              short_description="Test short description4", code="Test code4")

    def test_name_content(self):
        course = Course.objects.get(pk=1)
        self.assertEquals(course.name, 'Test name1')

    def test_description_content(self):
        course = Course.objects.get(pk=2)
        self.assertEquals(course.description, 'Test description2')

    def test_short_description_content(self):
        course = Course.objects.get(pk=3)
        self.assertEquals(course.short_description, 'Test short description3')

    def test_code_content(self):
        course = Course.objects.get(pk=4)
        self.assertEquals(course.code, 'Test code4')

    def test_edit_content(self):
        course = Course.objects.get(pk=4)
        course.code = "Edited code"
        course.name = "Edited name"
        course.save()
        edited_course = Course.objects.get(pk=4)
        self.assertEquals(edited_course.code, "Edited code")
        self.assertEquals(edited_course.name,  "Edited name")
