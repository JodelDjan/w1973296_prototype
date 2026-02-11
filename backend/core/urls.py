from django.contrib import admin
from django.urls import path, include
from posts.api import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

post_router = DefaultRouter()
post_router.register(r'posts', views.PostViewSet, basename='post')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
    path('api/accounts/', include('accounts.urls')),
]



