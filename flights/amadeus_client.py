import requests
from django.conf import settings

BASE_URL = "https://test.api.amadeus.com"


def get_access_token():
    """Get access token from Amadeus API."""
    client_id = settings.AMADEUS_CLIENT_ID
    client_secret = settings.AMADEUS_CLIENT_SECRET

    if not client_id or not client_secret:
        raise RuntimeError(
            "Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET in settings.py."
        )

    url = f"{BASE_URL}/v1/security/oauth2/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    print(f"[DEBUG] POST {url}")
    print(f"[DEBUG] Request data: grant_type={data['grant_type']}, client_id={client_id[:5]}..., client_secret=***")

    response = requests.post(url, headers=headers, data=data)

    print(f"[DEBUG] Response status: {response.status_code}")

    if not response.ok:
        raise RuntimeError(
            f"Token request failed ({response.status_code}): {response.text}"
        )

    json_data = response.json()
    return json_data["access_token"]


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
        "currencyCode": "IDR",
        "max": 10,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    data = response.json()
    return data.get("data", [])
