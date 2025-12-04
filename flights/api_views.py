from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .serializers import FlightSearchSerializer, BookingSerializer
from .amadeus_client import search_flights
from .airport_mapping import get_iata_code


@csrf_exempt
@api_view(['POST'])
def search_flights_api(request):
    """API endpoint for searching flights."""
    print(f"[DEBUG] Received data: {request.data}")
    serializer = FlightSearchSerializer(data=request.data)
    
    if not serializer.is_valid():
        print(f"[DEBUG] Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    origin_input = data['origin']
    destination_input = data['destination']
    departure_date = data['departure_date']
    return_date = data.get('return_date')
    trip_type = data.get('trip_type', 'one-way')
    adults = data.get('adults', 1)
    
    # Validate dates
    if departure_date < datetime.now().date():
        return Response(
            {"error": "Tanggal keberangkatan tidak boleh di masa lalu."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if trip_type == 'round-trip' and not return_date:
        return Response(
            {"error": "Tanggal kembali wajib diisi untuk penerbangan pulang-pergi."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if return_date and return_date < departure_date:
        return Response(
            {"error": "Tanggal kembali tidak boleh lebih awal dari tanggal keberangkatan."},
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
            adults=adults,
            return_date=str(return_date) if return_date else None
        )
        
        return Response({
            "success": True,
            "trip_type": trip_type,
            "origin": origin_code,
            "destination": destination_code,
            "departure_date": str(departure_date),
            "return_date": str(return_date) if return_date else None,
            "flights": flights_data
        })
    
    except Exception as e:
        return Response(
            {"error": f"Gagal mencari penerbangan: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
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
