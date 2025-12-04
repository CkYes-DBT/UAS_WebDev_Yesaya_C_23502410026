import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights, searchParams } = location.state || { flights: [], searchParams: {} };

  // Airline logos mapping - using reliable CDN
  const airlineLogos = {
    'GA': 'https://content.airhex.com/content/logos/airlines_GA_100_100_s.png',
    'QZ': 'https://content.airhex.com/content/logos/airlines_QZ_100_100_s.png',
    'JT': 'https://content.airhex.com/content/logos/airlines_JT_100_100_s.png',
    'IU': 'https://content.airhex.com/content/logos/airlines_IU_100_100_s.png',
    'ID': 'https://content.airhex.com/content/logos/airlines_ID_100_100_s.png',
    'SJ': 'https://content.airhex.com/content/logos/airlines_SJ_100_100_s.png',
    'QG': 'https://content.airhex.com/content/logos/airlines_QG_100_100_s.png',
    'SQ': 'https://content.airhex.com/content/logos/airlines_SQ_100_100_s.png',
    'MH': 'https://content.airhex.com/content/logos/airlines_MH_100_100_s.png',
    'TG': 'https://content.airhex.com/content/logos/airlines_TG_100_100_s.png',
    'CX': 'https://content.airhex.com/content/logos/airlines_CX_100_100_s.png',
    'NH': 'https://content.airhex.com/content/logos/airlines_NH_100_100_s.png',
    'JL': 'https://content.airhex.com/content/logos/airlines_JL_100_100_s.png',
    'KE': 'https://content.airhex.com/content/logos/airlines_KE_100_100_s.png',
    'CZ': 'https://content.airhex.com/content/logos/airlines_CZ_100_100_s.png',
    'MU': 'https://content.airhex.com/content/logos/airlines_MU_100_100_s.png',
    'EK': 'https://content.airhex.com/content/logos/airlines_EK_100_100_s.png',
    'QR': 'https://content.airhex.com/content/logos/airlines_QR_100_100_s.png',
    'EY': 'https://content.airhex.com/content/logos/airlines_EY_100_100_s.png',
    'TR': 'https://content.airhex.com/content/logos/airlines_TR_100_100_s.png',
    'OD': 'https://content.airhex.com/content/logos/airlines_OD_100_100_s.png',
  };

  // Airline names mapping
  const airlineNames = {
    'GA': 'Garuda Indonesia',
    'QZ': 'AirAsia',
    'JT': 'Lion Air',
    'IU': 'Super Air Jet',
    'ID': 'Batik Air',
    'SJ': 'Sriwijaya Air',
    'QG': 'Citilink',
    'SQ': 'Singapore Airlines',
    'MH': 'Malaysia Airlines',
    'TG': 'Thai Airways',
    'CX': 'Cathay Pacific',
    'NH': 'ANA',
    'JL': 'Japan Airlines',
    'KE': 'Korean Air',
    'CZ': 'China Southern',
    'MU': 'China Eastern',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'EY': 'Etihad',
    'TR': 'Scoot',
    'OD': 'Batik Air Malaysia',
  };

  const formatPrice = (price) => {
    const amount = parseFloat(price);
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const calculateDuration = (departure, arrival) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBooking = (flight) => {
    navigate('/booking', { state: { flight, searchParams } });
  };

  if (!flights || flights.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Tidak ada hasil pencarian. <a href="/">Kembali ke pencarian</a>
        </div>
      </div>
    );
  }

  // Get first segment for title
  const firstFlight = flights[0];
  const firstSegment = firstFlight.itineraries[0].segments[0];
  const lastSegment = firstFlight.itineraries[0].segments[firstFlight.itineraries[0].segments.length - 1];

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-white border-bottom shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <button className="btn btn-link text-decoration-none p-0 text-primary mb-2 d-flex align-items-center" onClick={() => navigate('/')}>
                <i className="bi bi-arrow-left me-2"></i>
                <span style={{ fontSize: '14px' }}>Ubah pencarian</span>
              </button>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h5 className="mb-0 fw-bold">{searchParams.origin}</h5>
                <i className="bi bi-arrow-right text-muted"></i>
                <h5 className="mb-0 fw-bold">{searchParams.destination}</h5>
              </div>
              <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '13px' }}>
                <span>
                  <i className="bi bi-calendar3 me-1"></i>
                  {formatDate(searchParams.departure_date)}
                </span>
                <span>
                  <i className="bi bi-person-fill me-1"></i>
                  {searchParams.adults || 1} penumpang
                </span>
                <span className="badge bg-primary-subtle text-primary">
                  {searchParams.trip_type === 'round-trip' ? 'Pulang-pergi' : 'Sekali jalan'}
                </span>
              </div>
            </div>
            <div>
              <div className="badge bg-success fs-6 px-3 py-2">
                {flights.length} penerbangan tersedia
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Flight List */}
        <div className="row">
          <div className="col-lg-12">
            
            {flights.map((flight, index) => {
              const itinerary = flight.itineraries[0];
              const segment = itinerary.segments[0];
              const lastSeg = itinerary.segments[itinerary.segments.length - 1];
              const carrierCode = segment.carrierCode;
              const isNonstop = itinerary.segments.length === 1;

              return (
                <div key={flight.id || index} className="card border-0 shadow-sm mb-3 hover-shadow" style={{ transition: 'all 0.3s', borderRadius: '12px' }}>
                  <div className="card-body p-3">
                    <div className="row align-items-center g-3">
                      {/* Airline Logo & Name */}
                      <div className="col-lg-3 col-md-4">
                        <div className="d-flex align-items-center gap-2">
                          <div className="flex-shrink-0">
                            <img 
                              src={airlineLogos[carrierCode] || `https://content.airhex.com/content/logos/airlines_${carrierCode}_100_100_s.png`}
                              alt={airlineNames[carrierCode] || carrierCode}
                              style={{ 
                                width: '48px', 
                                height: '48px', 
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                // If logo fails to load, show airline name only
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="fw-semibold text-truncate" style={{ fontSize: '14px' }}>
                              {airlineNames[carrierCode] || carrierCode}
                            </div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>
                              {segment.number}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flight Times */}
                      <div className="col-lg-5 col-md-5">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="text-center">
                            <div className="fw-bold" style={{ fontSize: '20px' }}>{formatTime(segment.departure.at)}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>{segment.departure.iataCode}</div>
                          </div>
                          
                          <div className="flex-grow-1 mx-3">
                            <div className="text-center text-muted mb-1" style={{ fontSize: '11px' }}>
                              {calculateDuration(segment.departure.at, lastSeg.arrival.at)}
                            </div>
                            <div className="position-relative d-flex align-items-center">
                              <div className="flex-grow-1" style={{ borderTop: '2px solid #dee2e6' }}></div>
                              {isNonstop ? (
                                <i className="bi bi-circle-fill text-success mx-2" style={{ fontSize: '6px' }}></i>
                              ) : (
                                <span className="badge bg-warning text-dark mx-2" style={{ fontSize: '9px', padding: '2px 6px' }}>
                                  {itinerary.segments.length - 1}
                                </span>
                              )}
                              <div className="flex-grow-1" style={{ borderTop: '2px solid #dee2e6' }}></div>
                            </div>
                            <div className="text-center text-muted mt-1" style={{ fontSize: '11px' }}>
                              {isNonstop ? 'Direct' : `${itinerary.segments.length - 1} stop`}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="fw-bold" style={{ fontSize: '20px' }}>{formatTime(lastSeg.arrival.at)}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>{lastSeg.arrival.iataCode}</div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Select */}
                      <div className="col-lg-4 col-md-3">
                        <div className="d-flex align-items-center justify-content-end gap-3">
                          <div className="text-end">
                            <div className="fw-bold text-primary mb-0" style={{ fontSize: '22px' }}>
                              {formatPrice(flight.price.total)}
                            </div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                              per {searchParams.adults || 1} pax
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-primary fw-semibold"
                              style={{ 
                                padding: '10px 24px',
                                fontSize: '14px',
                                borderRadius: '8px'
                              }}
                              onClick={() => handleBooking(flight)}
                            >
                              Pilih
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info for connecting flights */}
                    {itinerary.segments.length > 1 && (
                      <div className="mt-3 pt-2 border-top">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-arrow-left-right text-warning" style={{ fontSize: '12px' }}></i>
                          <small className="text-muted" style={{ fontSize: '12px' }}>
                            Transit di: {itinerary.segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
