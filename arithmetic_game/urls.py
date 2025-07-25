from django.urls import path
from . import views

app_name = 'arithmetic_game'
urlpatterns = [
    path('', views.index, name='index'),
    path('game/', views.game, name='game'),
]
