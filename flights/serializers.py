from rest_framework import serializers


class FlightSearchSerializer(serializers.Serializer):
    """Serializer for flight search request."""
    origin = serializers.CharField(max_length=100, help_text="Origin city or IATA code")
    destination = serializers.CharField(max_length=100, help_text="Destination city or IATA code")
    departure_date = serializers.DateField(help_text="Departure date (YYYY-MM-DD)")
    adults = serializers.IntegerField(default=1, min_value=1, max_value=9, help_text="Number of adults")


class FlightOfferSerializer(serializers.Serializer):
    """Serializer for flight offer response."""
    id = serializers.CharField()
    price = serializers.DictField()
    itineraries = serializers.ListField()
    travelerPricings = serializers.ListField()


class BookingSerializer(serializers.Serializer):
    """Serializer for booking request."""
    flight_id = serializers.CharField()
    passenger_name = serializers.CharField(max_length=200)
    passenger_email = serializers.EmailField()
    passenger_phone = serializers.CharField(max_length=20)
