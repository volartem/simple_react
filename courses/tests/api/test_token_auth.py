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
        self.assertTrue(response.status_code, 200)
        self.assertTrue(response.data.get("access"))
        self.assertTrue(response.data.get("refresh"))

    def test_jwt_get_tokens_error(self):
        data = {
            "username": "admin",
            "password": "password"
        }
        response = self.client.post("/api/token/", data, format="json")
        self.assertTrue(response.status_code, 200)
        self.assertIsNone(response.data.get("access"))
        self.assertIsNone(response.data.get("refresh"))

    def test_jwt_refresh_tokens_success(self):
        data = {
            "refresh": self.refresh_token
        }
        response = self.client.post("/api/token/refresh/", data, format="json")
        self.assertTrue(response.status_code, 200)
        self.assertNotEquals(response.data.get("access"), self.token)
