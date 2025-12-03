import os
from django.core.management.base import BaseCommand
from flights.amadeus_client import get_access_token, CLIENT_ID, CLIENT_SECRET


class Command(BaseCommand):
    help = 'Check Amadeus API credentials'

    def handle(self, *args, **options):
        self.stdout.write("=" * 50)
        self.stdout.write("Checking Amadeus API Credentials")
        self.stdout.write("=" * 50)

        # Mask credentials
        if CLIENT_ID:
            masked_id = CLIENT_ID[:3] + "***" + CLIENT_ID[-3:] if len(CLIENT_ID) > 6 else "***"
        else:
            masked_id = "NOT SET"

        if CLIENT_SECRET:
            masked_secret = CLIENT_SECRET[:3] + "***" + CLIENT_SECRET[-3:] if len(CLIENT_SECRET) > 6 else "***"
        else:
            masked_secret = "NOT SET"

        self.stdout.write(f"CLIENT_ID: {masked_id}")
        self.stdout.write(f"CLIENT_SECRET: {masked_secret}")
        self.stdout.write("")

        # Try to get access token
        try:
            self.stdout.write("Attempting to get access token...")
            token = get_access_token()
            masked_token = token[:15] + "***" if len(token) > 15 else "***"
            self.stdout.write(self.style.SUCCESS(f"✓ Access token request succeeded"))
            self.stdout.write(f"Token (first 15 chars): {masked_token}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✗ Access token request failed"))
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
