from django.urls import path
from rest_framework.routers import DefaultRouter
from posts.api import views

post_router = DefaultRouter()
post_router.register(r'posts', views.PostViewSet)