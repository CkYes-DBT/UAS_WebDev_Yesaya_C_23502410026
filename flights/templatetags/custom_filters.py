from django import template
from datetime import datetime

register = template.Library()


@register.filter
def format_price(value):
    """Format price to Indonesian Rupiah"""
    try:
        price = float(value)
        return f"Rp {price:,.0f}".replace(",", ".")
    except:
        return value


@register.filter
def format_datetime(value):
    """Format ISO datetime to readable format"""
    try:
        # Parse ISO format datetime
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return dt.strftime("%d %b %Y, %H:%M")
    except:
        return value


@register.filter
def format_time_only(value):
    """Extract time only from ISO datetime"""
    try:
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return dt.strftime("%H:%M")
    except:
        return value


@register.filter
def format_date_only(value):
    """Extract date only from ISO datetime"""
    try:
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return dt.strftime("%d %b %Y")
    except:
        return value


@register.filter
def calculate_duration(segments):
    """Calculate flight duration from segments"""
    try:
        if not segments or len(segments) == 0:
            return "N/A"
        
        first_departure = datetime.fromisoformat(segments[0]['departure']['at'].replace('Z', '+00:00'))
        last_arrival = datetime.fromisoformat(segments[-1]['arrival']['at'].replace('Z', '+00:00'))
        
        duration = last_arrival - first_departure
        hours = duration.seconds // 3600
        minutes = (duration.seconds % 3600) // 60
        
        return f"{hours}h {minutes}m"
    except:
        return "N/A"
