from django.urls import path
from . import views

app_name = 'arithmetic_game'
urlpatterns = [
    path('', views.index, name='index'),
    path('settings/', views.settings, name='settings'),
    path('game/', views.game, name='game'),
    path('pyramid/', views.pyramid_game, name='pyramid_game'),
    path('pyramid/validate/', views.validate_pyramid, name='validate_pyramid'),
]
