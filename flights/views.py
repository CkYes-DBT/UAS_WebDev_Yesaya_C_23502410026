from django.shortcuts import render
from .amadeus_client import search_flights


def search_flight(request):
    if request.method == "POST":
        destination = request.POST.get("destination")
        departure_date = request.POST.get("departure_date")
        trip_type = request.POST.get("trip_type")
        return_date = request.POST.get("return_date")
        
        origin = "CGK"
        error = None
        flights = []
        
        try:
            flights = search_flights(origin="CGK", destination=destination, departure_date=departure_date, adults=1)
        except Exception as e:
            error = str(e)
            flights = []
        
        context = {
            "destination": destination,
            "departure_date": departure_date,
            "trip_type": trip_type,
            "return_date": return_date,
            "flights": flights,
            "error": error,
        }
        return render(request, "flights/flight_results.html", context)
    
    return render(request, "flights/search_flight.html")
