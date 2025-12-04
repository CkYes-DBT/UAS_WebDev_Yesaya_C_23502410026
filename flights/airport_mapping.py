"""
Airport IATA code mapping for common Indonesian and Asian cities
"""

CITY_TO_IATA = {
    # Indonesia
    "jakarta": "CGK",
    "soekarno hatta": "CGK",
    "soekarno-hatta": "CGK",
    "cengkareng": "CGK",
    
    "bali": "DPS",
    "denpasar": "DPS",
    "ngurah rai": "DPS",
    
    "surabaya": "SUB",
    "juanda": "SUB",
    
    "medan": "KNO",
    "kualanamu": "KNO",
    "kuala namu": "KNO",
    
    "yogyakarta": "JOG",
    "jogja": "JOG",
    "yogya": "JOG",
    "adisucipto": "JOG",
    
    "bandung": "BDO",
    "husein sastranegara": "BDO",
    
    "semarang": "SRG",
    "ahmad yani": "SRG",
    
    "solo": "SOC",
    "surakarta": "SOC",
    "adisumarmo": "SOC",
    
    "makassar": "UPG",
    "ujung pandang": "UPG",
    "sultan hasanuddin": "UPG",
    
    "balikpapan": "BPN",
    "sepinggan": "BPN",
    
    "manado": "MDC",
    "sam ratulangi": "MDC",
    
    "palembang": "PLM",
    "sultan mahmud badaruddin": "PLM",
    
    "lombok": "LOP",
    "praya": "LOP",
    "mataram": "LOP",
    
    "batam": "BTH",
    "hang nadim": "BTH",
    
    "padang": "PDG",
    "minangkabau": "PDG",
    
    "pekanbaru": "PKU",
    "sultan syarif kasim": "PKU",
    
    "jambi": "DJB",
    "sultan thaha": "DJB",
    
    "banjarmasin": "BDJ",
    "syamsudin noor": "BDJ",
    
    "pontianak": "PNK",
    "supadio": "PNK",
    
    "malang": "MLG",
    "abdul rachman saleh": "MLG",
    
    "ambon": "AMQ",
    "pattimura": "AMQ",
    
    # Southeast Asia
    "bangkok": "BKK",
    "suvarnabhumi": "BKK",
    
    "singapore": "SIN",
    "singapura": "SIN",
    "changi": "SIN",
    
    "kuala lumpur": "KUL",
    "kl": "KUL",
    
    "penang": "PEN",
    "george town": "PEN",
    
    "phuket": "HKT",
    
    "hanoi": "HAN",
    
    "ho chi minh": "SGN",
    "saigon": "SGN",
    
    "manila": "MNL",
    
    "phnom penh": "PNH",
    
    "yangon": "RGN",
    "rangoon": "RGN",
    
    "vientiane": "VTE",
    
    # East Asia
    "tokyo": "NRT",
    "narita": "NRT",
    
    "osaka": "KIX",
    "kansai": "KIX",
    
    "seoul": "ICN",
    "incheon": "ICN",
    
    "beijing": "PEK",
    "peking": "PEK",
    
    "shanghai": "PVG",
    "pudong": "PVG",
    
    "hong kong": "HKG",
    "hongkong": "HKG",
    
    "taipei": "TPE",
    
    # Middle East
    "dubai": "DXB",
    
    "doha": "DOH",
    
    "abu dhabi": "AUH",
    
    "jeddah": "JED",
    
    "riyadh": "RUH",
    
    # Australia
    "sydney": "SYD",
    
    "melbourne": "MEL",
    
    "perth": "PER",
    
    "brisbane": "BNE",
    
    # Europe
    "london": "LHR",
    "heathrow": "LHR",
    
    "paris": "CDG",
    "charles de gaulle": "CDG",
    
    "amsterdam": "AMS",
    "schiphol": "AMS",
    
    "frankfurt": "FRA",
    
    "rome": "FCO",
    "fiumicino": "FCO",
    
    # Americas
    "new york": "JFK",
    "jfk": "JFK",
    
    "los angeles": "LAX",
    "la": "LAX",
    
    "san francisco": "SFO",
    
    "chicago": "ORD",
    
    "miami": "MIA",
}


def get_iata_code(city_input):
    """
    Convert city name or IATA code to valid IATA code
    
    Args:
        city_input: User input (can be city name or IATA code)
    
    Returns:
        tuple: (iata_code, is_known) - IATA code and whether it was found in database
    """
    if not city_input:
        return ("", False)
    
    # Clean input
    cleaned = city_input.strip().lower()
    
    # Try to find in mapping first
    if cleaned in CITY_TO_IATA:
        return (CITY_TO_IATA[cleaned], True)
    
    # Try partial match (e.g., "bkk" in "bangkok bkk")
    for city_name, iata_code in CITY_TO_IATA.items():
        if city_name in cleaned or cleaned in city_name:
            return (iata_code, True)
    
    # If already 3 letters (might be valid IATA code), accept it as valid
    if len(cleaned) == 3 and cleaned.isalpha():
        return (cleaned.upper(), True)
    
    # Not found - return None to signal unknown
    return (None, False)


def get_city_suggestions(query):
    """
    Get city suggestions for autocomplete
    
    Args:
        query: User's partial input
    
    Returns:
        list: List of matching cities with their IATA codes
    """
    if not query or len(query) < 2:
        return []
    
    query_lower = query.lower()
    suggestions = []
    
    for city_name, iata_code in CITY_TO_IATA.items():
        if query_lower in city_name or city_name.startswith(query_lower):
            # Format: "Jakarta (CGK)"
            display_name = city_name.title()
            suggestions.append({
                "city": display_name,
                "iata": iata_code,
                "display": f"{display_name} ({iata_code})"
            })
    
    # Limit to 10 suggestions
    return suggestions[:10]
