from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home'),          # raíz del sitio → página de inicio
    path('chatbot/', views.chat_page, name='chatbot'),          
    path('chatbot/api/', views.chat_api, name='chatbot_api'),
]

