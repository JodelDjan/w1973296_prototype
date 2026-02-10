from django.urls import path
from .views import RegisterView
from django.urls import path
from .views import RegisterView, EmailLoginView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', EmailLoginView.as_view(), name='email_login'),
    path('me/', MeView.as_view(), name='me'),
]

