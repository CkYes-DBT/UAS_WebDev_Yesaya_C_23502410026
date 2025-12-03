import os
import requests

BASE_URL = "https://test.api.amadeus.com"
CLIENT_ID = os.getenv("AMADEUS_CLIENT_ID")
CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET")


def get_access_token():
    """Get access token from Amadeus API."""
    if not CLIENT_ID or not CLIENT_SECRET:
        raise Exception("AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set in .env file")
    
    url = f"{BASE_URL}/v1/security/oauth2/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    
    return response.json()["access_token"]


def search_flights(origin, destination, departure_date, adults=1):
    """Search for flight offers using Amadeus API."""
    access_token = get_access_token()
    
    url = f"{BASE_URL}/v2/shopping/flight-offers"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {
        "originLocationCode": origin,
        "destinationLocationCode": destination,
        "departureDate": departure_date,
        "adults": adults,
        "currencyCode": "USD",
        "max": 10
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    
    return response.json().get("data", [])
