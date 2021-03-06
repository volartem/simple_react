"""simple_react URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import re_path, include
from django.views.generic import TemplateView
from rest_framework_swagger.views import get_swagger_view
from rest_framework_simplejwt import views as jwt_views
from custom_auth.views import LogoutView

schema_view = get_swagger_view(title='COURSES API')

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path('^api/token/$', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path('^api/token/refresh/$', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    re_path('^api/logout/$', LogoutView.as_view(), name='logout_api_view'),
    re_path(r'^swagger-docs/', schema_view),

    re_path(r'^api/v1/', include('courses.urls')),
    re_path(r'^', TemplateView.as_view(template_name='simple_react/index.html')),
]
