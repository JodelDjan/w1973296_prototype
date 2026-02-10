from django.urls import path
from rest_framework.routers import DefaultRouter
from posts.api import views
from .views import ClosePostView

post_router = DefaultRouter()
post_router.register(r'posts', views.PostViewSet)


urlpatterns = [
    path('close/<int:post_id>/', ClosePostView.as_view(), name='close_post'),
]
