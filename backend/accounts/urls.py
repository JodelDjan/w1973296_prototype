from django.urls import path
from .views import RegisterView
from django.urls import path
from .views import RegisterView, EmailLoginView, MeView, researcher_directory
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', EmailLoginView.as_view(), name='email_login'),
    path('me/', MeView.as_view(), name='me'),
    path('researchers/', researcher_directory, name='researchers'), 
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

