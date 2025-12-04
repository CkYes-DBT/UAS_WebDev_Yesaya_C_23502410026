from django.urls import path
from . import api_views

# API endpoints (REST)
urlpatterns = [
    path('api/search/', api_views.search_flights_api, name='api_search_flights'),
    path('api/booking/', api_views.create_booking_api, name='api_create_booking'),
]
