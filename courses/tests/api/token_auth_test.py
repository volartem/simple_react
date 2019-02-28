from rest_framework.test import APITestCase


class TokenAuthApiTest(APITestCase):
    fixtures = [
        "initial.json",
    ]

    def test_jwt_get_tokens_success(self):
        data = {
            "username": "admin",
            "password": "password123"
        }
        response = self.client.post("/api/token/", data, format="json")
        self.assertTrue(response.status_code, 200)
        self.assertTrue(response.data.get("access"))
        self.assertTrue(response.data.get("refresh"))

    def test_jwt_get_tokens_error(self):
        data = {
            "username": "admin",
            "password": "password12"
        }
        response = self.client.post("/api/token/", data, format="json")
        self.assertTrue(response.status_code, 200)
        self.assertIsNone(response.data.get("access"))
        self.assertIsNone(response.data.get("refresh"))
