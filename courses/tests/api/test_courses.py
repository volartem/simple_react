from courses.models import Course
from rest_framework.test import APITestCase
from simple_react.settings import REST_FRAMEWORK as rf
from django.forms.models import model_to_dict


class CourseApiTest(APITestCase):
    fixtures = [
        "initial.json",
    ]

    def setUp(self):
        data = {
            "username": "admin",
            "password": "password123"
        }
        response = self.client.post("/api/token/", data, format="json")
        self.token = response.data.get("access")
        self.refresh_token = response.data.get("refresh")

    def test_courses_list_response(self):
        response = self.client.get("/api/v1/courses/", format="json")
        self.assertEquals(response.status_code, 200)

    def test_courses_list_count(self):
        response = self.client.get("/api/v1/courses/", format="json")
        self.assertEquals(len(response.data), 3)
        self.assertEquals(len(response.data.get("result")), rf.get("PAGE_SIZE"))
        self.assertEquals(response.data.get("total"), 5)

    def test_courses_list_limit(self):
        data = {"limit": 4}
        response = self.client.get("/api/v1/courses/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 4)
        self.assertEquals(response.data.get("total"), 5)

    def test_courses_list_limit_offset_empty(self):
        data = {"limit": 3, "offset": 8}
        response = self.client.get("/api/v1/courses/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 0)
        self.assertEquals(response.data.get("total"), 5)

    def test_courses_list_search_empty(self):
        data = {"search": "fsdfsdfsdfsdf"}
        response = self.client.get("/api/v1/courses/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 0)
        self.assertEquals(response.data.get("total"), 0)

    def test_courses_list_search_find(self):
        data = {"search": "Java"}
        response = self.client.get("/api/v1/courses/", data, format="json")
        self.assertEquals(len(response.data.get("result")), 2)
        self.assertEquals(response.data.get("total"), 2)

    def test_courses_create_401(self):
        data = {"name": "C", "short_description": "short description", "description": "description", "code": "code-x"}
        response = self.client.post("/api/v1/courses/", data, format="json")
        self.assertEquals(response.status_code, 401)
        self.assertEquals(response.data.get("detail"), "Authentication credentials were not provided.")

    def test_courses_create(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        data = {"name": "C", "short_description": "short description", "description": "description", "code": "code-x"}
        response = self.client.post("/api/v1/courses/", data, format="json")
        self.assertEquals(response.status_code, 201)
        self.assertEquals(response.data.get("item")["id"], 6)

    def test_courses_create_empty_field_error(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        data = {"name": "new course", "short_description": "short description"}
        response = self.client.post("/api/v1/courses/", data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertIsNone(response.data.get("item"))
        self.assertEquals(response.data.get("code")[0], "This field is required.")

    def test_courses_create_duplicate_name_field_error(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        data = {"name": "Java", "code": "byte code"}
        response = self.client.post("/api/v1/courses/", data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertIsNone(response.data.get("item"))
        self.assertEquals(response.data.get("name")[0], "course with this name already exists.")

    def test_courses_retrieve(self):
        course = Course.objects.get(pk=1)
        response = self.client.get("/api/v1/courses/{}/".format(course.id), format="json")
        self.assertEquals(response.data["id"], course.id)
        self.assertEquals(response.data["name"], course.name)
        self.assertEquals(response.data["description"], course.description)

    def test_courses_update_empty_field(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        data = {"name": "", "short_description": "short description", "description": "description", "code": "code-x"}
        response = self.client.put("/api/v1/courses/{}/".format(2), data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.data.get("name")[0], "This field may not be blank.")

    def test_courses_update_401(self):
        course = Course.objects.get(pk=2)
        data = model_to_dict(course)
        data["name"] = "New"
        response = self.client.put("/api/v1/courses/{}/".format(data["id"]), data, format="json")
        self.assertEquals(response.status_code, 401)
        self.assertEquals(response.data.get("detail"), "Authentication credentials were not provided.")

    def test_courses_update(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        course = Course.objects.get(pk=2)
        data = model_to_dict(course)
        data["name"] = "New"
        response = self.client.put("/api/v1/courses/{}/".format(data["id"]), data, format="json")
        self.assertEquals(response.data["id"], 2)
        self.assertEquals(response.data["name"], "New")

    def test_courses_delete_401(self):
        course = Course.objects.get(pk=2)
        response = self.client.delete("/api/v1/courses/{}/".format(course.id), format="json")
        self.assertEquals(response.status_code, 401)

    def test_courses_delete(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        course = Course.objects.get(pk=2)
        all_courses = Course.objects.count()
        response = self.client.delete("/api/v1/courses/{}/".format(course.id), format="json")
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data.get("total"), all_courses - 1)
