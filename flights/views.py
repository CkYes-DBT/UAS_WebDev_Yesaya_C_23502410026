from django.shortcuts import render

def search_flight(request):
    if request.method == "POST":
        destination = request.POST.get("destination")
        departure_date = request.POST.get("departure_date")
        trip_type = request.POST.get("trip_type")
        return_date = request.POST.get("return_date")

        context = {
            "destination": destination,
            "departure_date": departure_date,
            "trip_type": trip_type,
            "return_date": return_date,
        }
        # later this will be replaced with real data from Amadeus API
        return render(request, "flights/flight_results.html", context)

    return render(request, "flights/search_flight.html")
