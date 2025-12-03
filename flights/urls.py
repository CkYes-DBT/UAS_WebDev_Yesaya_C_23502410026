from django.urls import path
from . import views

urlpatterns = [
    path('', views.search_flight, name='search_flight'),
    path('booking/', views.flight_booking, name='flight_booking'),
]
