from courses.models import Student, Course
from rest_framework.test import APITestCase
from simple_react.settings import REST_FRAMEWORK as rf
from django.forms.models import model_to_dict


class StudentApiTest(APITestCase):
    fixtures = [
        "initial.json",
    ]

    def test_students_list_response(self):
        response = self.client.get("/api/v1/students/", format="json")
        self.assertTrue(response.status_code, 200)

    def test_students_list_count(self):
        response = self.client.get("/api/v1/students/", format="json")
        self.assertEquals(len(response.data), 3)
        self.assertEquals(len(response.data.get("result")), rf.get("PAGE_SIZE"))
        self.assertEquals(response.data.get("total"), 5)

    def test_students_list_limit(self):
        data = {"limit": 3}
        response = self.client.get("/api/v1/students/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 3)
        self.assertEquals(response.data.get("total"), 5)

    def test_students_list_limit_offset_empty(self):
        data = {"limit": 3, "offset": 5}
        response = self.client.get("/api/v1/students/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 0)
        self.assertEquals(response.data.get("total"), 5)

    def test_students_list_search_find(self):
        data = {"search": "Bruce"}
        response = self.client.get("/api/v1/students/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 1)
        self.assertEquals(response.data.get("total"), 1)

    def test_courses_list_search_empty(self):
        data = {"search": "John"}
        response = self.client.get("/api/v1/students/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 0)
        self.assertEquals(response.data.get("total"), 0)

    def test_students_create_success(self):
        data = {"name": "Bill", "surname": "Gets", "email": "geits@com.ru"}
        response = self.client.post("/api/v1/students/", data, format="json")
        self.assertEquals(response.data.get("item")["id"], 6)

    def test_students_create_empty_field_error(self):
        data = {"name": "Bill", "surname": "Gets"}
        response = self.client.post("/api/v1/students/", data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertIsNone(response.data.get("item"))
        self.assertEquals(response.data.get("email")[0], "This field is required.")

    def test_students_create_duplicate_email_field_error(self):
        data = {"name": "Bill", "surname": "Gets", "email": "jobs@email.com"}
        response = self.client.post("/api/v1/students/", data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertIsNone(response.data.get("item"))
        self.assertEquals(response.data.get("email")[0], "student with this email already exists.")

    def test_students_retrieve(self):
        student = Student.objects.get(pk=1)
        response = self.client.get("/api/v1/students/{}/".format(student.id), format="json")
        self.assertEquals(response.data["id"], student.id)
        self.assertEquals(response.data["name"], student.name)
        self.assertEquals(response.data["surname"], student.surname)

    def test_students_update(self):
        student = Student.objects.get(pk=2)
        data = model_to_dict(student)
        list_courses = [obj.name for obj in student.courses.all()]
        data["courses"] = list_courses
        data["name"] = "nut"
        response = self.client.put("/api/v1/students/{}/".format(data["id"]), data, format="json")
        self.assertEquals(response.data["id"], 2)
        self.assertEquals(response.data["name"], "nut")

    def test_students_delete(self):
        student = Student.objects.get(pk=2)
        all_students = Student.objects.count()
        response = self.client.delete("/api/v1/students/{}/".format(student.id), format="json")
        self.assertNotEquals(response.data.get("total"), all_students)

