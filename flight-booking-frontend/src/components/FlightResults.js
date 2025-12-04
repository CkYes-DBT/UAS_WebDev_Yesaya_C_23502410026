import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights, searchParams } = location.state || { flights: [], searchParams: {} };

  const formatPrice = (price) => {
    const amount = parseFloat(price);
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const calculateDuration = (departure, arrival) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
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

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <h3 className="text-white mb-0">
            <i className="bi bi-airplane-fill me-2"></i>
            Hasil Pencarian: {searchParams.origin} → {searchParams.destination}
          </h3>
          <p className="text-white-50 mb-0">{searchParams.departure_date}</p>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Maskapai</th>
                  <th>Waktu Keberangkatan</th>
                  <th>Waktu Tiba</th>
                  <th>Durasi</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => {
                  const segment = flight.itineraries[0].segments[0];
                  const departure = segment.departure.at;
                  const arrival = segment.arrival.at;
                  const carrier = segment.carrierCode;
                  const price = flight.price.total;
                  const currency = flight.price.currency;

                  return (
                    <tr key={flight.id || index}>
                      <td>
                        <strong>{carrier}</strong>
                        <br />
                        <small className="text-muted">
                          {segment.departure.iataCode} → {segment.arrival.iataCode}
                        </small>
                      </td>
                      <td>{formatDateTime(departure)}</td>
                      <td>{formatDateTime(arrival)}</td>
                      <td>{calculateDuration(departure, arrival)}</td>
                      <td>
                        <strong className="text-success">
                          {formatPrice(price)}
                        </strong>
                        <br />
                        <small className="text-muted">{currency}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleBooking(flight)}
                        >
                          <i className="bi bi-cart-fill me-1"></i>
                          Pesan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-light">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-2"></i>
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
