from rest_framework.test import APITestCase


class TokenAuthApiTest(APITestCase):
    fixtures = [
        "initial.json",
    ]

    @staticmethod
    def get_data():
        return {
            "username": "admin",
            "password": "password123"
        }

    def setUp(self):
        data = self.get_data()
        response = self.client.post("/api/token/", data, format="json")
        self.token = response.data.get("access")
        self.refresh_token = response.data.get("refresh")

    def test_jwt_get_tokens_success(self):
        data = self.get_data()
        response = self.client.post("/api/token/", data, format="json")
        self.assertEquals(response.status_code, 200)
        self.assertTrue(response.data.get("access"))
        self.assertTrue(response.data.get("refresh"))

    def test_jwt_get_tokens_error(self):
        data = {
            "username": "admin",
            "password": "password"
        }
        response = self.client.post("/api/token/", data, format="json")
        self.assertEquals(response.status_code, 400)
        self.assertIsNone(response.data.get("access"))
        self.assertIsNone(response.data.get("refresh"))

    def test_jwt_refresh_tokens_success(self):
        data = {
            "refresh": self.refresh_token
        }
        response = self.client.post("/api/token/refresh/", data, format="json")
        self.assertEquals(response.status_code, 200)
        self.assertNotEquals(response.data.get("access"), self.token)

    def test_jwt_logout_success(self):
        # login
        data = self.get_data()
        response = self.client.post("/api/token/", data, format="json")
        access_token = response.data.get("access")
        self.assertEquals(response.status_code, 200)
        self.assertTrue(access_token)
        self.assertTrue(response.data.get("refresh"))

        # logout
        data = {
            "refresh": response.data.get("refresh")
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.post("/api/logout/", data, format="json")
        self.assertEquals(response.status_code, 204)

        # trying refresh with old token
        response = self.client.post("/api/token/refresh/", data, format="json")
        self.assertEquals(response.status_code, 401)

        # post request token valid for expired time
        data = {"name": "C++", "short_description": "short description", "description": "description", "code": "code-c"}
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.post("/api/v1/courses/", data, format="json")
        self.assertEquals(response.status_code, 201)
