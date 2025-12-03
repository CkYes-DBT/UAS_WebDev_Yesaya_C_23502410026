import os
import requests

BASE_URL = "https://test.api.amadeus.com"

CLIENT_ID = os.getenv("AMADEUS_CLIENT_ID")
CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET")


def get_access_token():
    """Get access token from Amadeus API."""
    if not CLIENT_ID or not CLIENT_SECRET:
        raise RuntimeError(
            "Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET in environment (.env file)."
        )

    url = f"{BASE_URL}/v1/security/oauth2/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    print(f"[DEBUG] POST {url}")
    print(f"[DEBUG] Request data: grant_type={data['grant_type']}, client_id={CLIENT_ID[:5]}..., client_secret=***")

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
