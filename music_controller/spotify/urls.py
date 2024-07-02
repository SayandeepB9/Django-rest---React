from django.urls import path
from .views import AuthURLView

urlpatterns = [
    path('get-auth-url', AuthURLView.as_view()),
]