from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .serializers import FlightSearchSerializer, BookingSerializer
from .amadeus_client import search_flights
from .airport_mapping import get_iata_code


@api_view(['POST'])
def search_flights_api(request):
    """API endpoint for searching flights."""
    serializer = FlightSearchSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    origin_input = data['origin']
    destination_input = data['destination']
    departure_date = data['departure_date']
    adults = data.get('adults', 1)
    
    # Validate date is not in the past
    if departure_date < datetime.now().date():
        return Response(
            {"error": "Tanggal keberangkatan tidak boleh di masa lalu."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Convert city names to IATA codes
    origin_code, origin_known = get_iata_code(origin_input)
    destination_code, destination_known = get_iata_code(destination_input)
    
    if not origin_known:
        return Response(
            {"error": f"Kode bandara untuk '{origin_input}' tidak ditemukan. Gunakan kode IATA 3 huruf (contoh: CGK, DPS)."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not destination_known:
        return Response(
            {"error": f"Kode bandara untuk '{destination_input}' tidak ditemukan. Gunakan kode IATA 3 huruf (contoh: SIN, BKK)."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Call Amadeus API
    try:
        flights_data = search_flights(
            origin=origin_code,
            destination=destination_code,
            departure_date=str(departure_date),
            adults=adults
        )
        
        return Response({
            "success": True,
            "origin": origin_code,
            "destination": destination_code,
            "departure_date": str(departure_date),
            "flights": flights_data.get("data", [])
        })
    
    except Exception as e:
        return Response(
            {"error": f"Gagal mencari penerbangan: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_booking_api(request):
    """API endpoint for creating a booking."""
    serializer = BookingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # In a real application, you would:
    # 1. Validate the flight_id with Amadeus
    # 2. Create the booking in Amadeus
    # 3. Store booking details in database
    # 4. Send confirmation email
    
    return Response({
        "success": True,
        "message": "Booking berhasil dibuat!",
        "booking_details": {
            "flight_id": data['flight_id'],
            "passenger_name": data['passenger_name'],
            "passenger_email": data['passenger_email'],
            "passenger_phone": data['passenger_phone'],
            "booking_reference": f"BOOK-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        }
    }, status=status.HTTP_201_CREATED)
