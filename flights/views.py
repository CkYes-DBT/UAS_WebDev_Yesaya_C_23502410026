from django.shortcuts import render
from .amadeus_client import search_flights
from .airport_mapping import get_iata_code
import json
from datetime import datetime, date


def search_flight(request):
    if request.method == "POST":
        # Get user input and convert to IATA codes
        origin_input = request.POST.get("origin", "CGK").strip()
        destination_input = request.POST.get("destination", "").strip()
        
        # Convert city names to IATA codes
        origin = get_iata_code(origin_input)
        destination = get_iata_code(destination_input)
        
        departure_date = request.POST.get("departure_date")
        trip_type = request.POST.get("trip_type")
        return_date = request.POST.get("return_date")
        
        error = None
        flights = []
        
        # Show what was converted
        conversion_note = None
        if origin_input.lower() != origin.lower():
            conversion_note = f"'{origin_input}' dikonversi menjadi {origin}"
        if destination_input.lower() != destination.lower():
            dest_note = f"'{destination_input}' dikonversi menjadi {destination}"
            conversion_note = f"{conversion_note}. {dest_note}" if conversion_note else dest_note
        
        # Validate date is not in the past
        try:
            departure_dt = datetime.strptime(departure_date, "%Y-%m-%d").date()
            today = date.today()
            
            if departure_dt < today:
                error = f"Tanggal keberangkatan tidak boleh di masa lalu. Silakan pilih tanggal mulai dari {today.strftime('%d %B %Y')}."
            elif origin == destination:
                error = "Kota keberangkatan dan tujuan tidak boleh sama."
            elif len(destination) != 3:
                error = "Kode IATA tujuan harus 3 huruf (contoh: BKK, SRG, DPS)."
            else:
                # Try to search flights
                try:
                    flights = search_flights(origin=origin, destination=destination, departure_date=departure_date, adults=1)
                    if not flights:
                        error = f"Tidak ada penerbangan yang tersedia untuk rute {origin} → {destination} pada tanggal {departure_date}. Coba tanggal lain atau rute berbeda."
                except Exception as e:
                    error_msg = str(e)
                    # Parse common Amadeus errors
                    if "400" in error_msg:
                        if "INVALID DATE" in error_msg.upper() or "past" in error_msg.lower():
                            error = f"Tanggal tidak valid. Amadeus API hanya menerima tanggal di masa depan (minimal besok)."
                        elif "INVALID" in error_msg.upper() and "LOCATION" in error_msg.upper():
                            error = f"Kode airport tidak valid. Pastikan {destination} adalah kode IATA yang benar (contoh: BKK untuk Bangkok, DPS untuk Bali)."
                        else:
                            error = f"Request tidak valid: {error_msg}"
                    elif "401" in error_msg:
                        error = "Credentials Amadeus API tidak valid. Hubungi administrator."
                    elif "429" in error_msg:
                        error = "Terlalu banyak request. Coba lagi dalam beberapa menit."
                    else:
                        error = f"Terjadi kesalahan: {error_msg}"
                    flights = []
        except ValueError:
            error = "Format tanggal tidak valid."
        
        context = {
            "origin": origin,
            "destination": destination,
            "origin_input": origin_input,
            "destination_input": destination_input,
            "conversion_note": conversion_note,
            "departure_date": departure_date,
            "trip_type": trip_type,
            "return_date": return_date,
            "flights": flights,
            "error": error,
        }
        return render(request, "flights/flight_results.html", context)
    
    # For GET request, pass today's date to template
    context = {
        "today": date.today().isoformat()
    }
    return render(request, "flights/search_flight.html", context)


def flight_booking(request):
    if request.method == "POST":
        flight_data = request.POST.get("flight_data")
        passenger_name = request.POST.get("passenger_name")
        passport_number = request.POST.get("passport_number")
        
        if flight_data:
            flight_info = json.loads(flight_data)
            
            context = {
                "flight_info": flight_info,
                "passenger_name": passenger_name,
                "passport_number": passport_number,
                "booking_confirmed": passenger_name and passport_number,
            }
            return render(request, "flights/flight_booking.html", context)
    
    # If GET or no flight data, redirect back
    return render(request, "flights/search_flight.html")
