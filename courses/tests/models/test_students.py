from django.test import TestCase
from courses.models import Student, Course


class StudentTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        course = Course.objects.create(name='Test name', description='Test description',
                                       short_description="Test short description", code="Test code")
        student = Student.objects.create(name="Name", surname="Surname", status=False, email="test@email.com")
        student.courses.add(course)
        Student.objects.create(name="Name2", surname="Surname2", status=False, email="test2@email.com")
        Student.objects.create(name="Name3", surname="Surname3", status=True, email="test3@email.com")

    def test_courses_students_relationship(self):
        student = Student.objects.get(pk=1)
        course = Course.objects.get(pk=5)                         # pk from previous db manipulations
        self.assertIn(course, student.courses.all())

    def test_create_instance(self):
        student = Student.objects.create(name="Test Name", surname="Test Surname", status=False,
                                         email="test_@email.com")
        self.assertTrue(isinstance(student, Student))

    def test_name_content(self):
        course = Student.objects.get(pk=1)
        self.assertEquals(course.name, 'Name')

    def test_surname_content(self):
        course = Student.objects.get(pk=2)
        self.assertEquals(course.surname, 'Surname2')

    def test_status_content(self):
        course = Student.objects.get(pk=3)
        self.assertTrue(course.status)

    def test_email_content(self):
        course = Student.objects.get(pk=3)
        self.assertEquals(course.email, "test3@email.com")

    def test_add_students_relationship(self):
        course = Course.objects.create(name='Test name1', description='Test description1',
                                       short_description="Test short description1", code="Test code1")
        course2 = Course.objects.create(name='Test name2', description='Test description2',
                                        short_description="Test short description2", code="Test code2")
        student = Student.objects.get(pk=3)
        student.courses.add(course.id)
        student.courses.add(course2.id)
        student.save()
        self.assertIn(course, student.courses.all())
        self.assertIn(course2, student.courses.all())

    def test_remove_students_relationship(self):
        student = Student.objects.get(pk=1)
        course = Course.objects.get(pk=5)
        self.assertTrue(student.courses.all())
        self.assertIn(course, student.courses.all())
        student.courses.remove(course)
        student.save()
        student__ = Student.objects.get(pk=1)
        self.assertFalse(student__.courses.all())
