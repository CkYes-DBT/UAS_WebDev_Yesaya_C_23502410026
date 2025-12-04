import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchParams } = location.state || {};
  
  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  if (!flight) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Data penerbangan tidak ditemukan. <a href="/">Kembali ke pencarian</a>
        </div>
      </div>
    );
  }

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/booking/', {
        flight_id: flight.id,
        ...formData
      });

      if (response.data.success) {
        setSuccess(true);
        setBookingDetails(response.data.booking_details);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat membuat booking');
    } finally {
      setLoading(false);
    }
  };

  const segment = flight.itineraries[0].segments[0];

  if (success && bookingDetails) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-success">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Booking Berhasil!
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-success mb-4">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Booking Anda telah berhasil dibuat. Silakan simpan kode booking berikut.
                </div>

                <h5 className="mb-3">Detail Booking</h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Kode Booking</strong></td>
                      <td><span className="badge bg-primary fs-6">{bookingDetails.booking_reference}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Nama Penumpang</strong></td>
                      <td>{bookingDetails.passenger_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Email</strong></td>
                      <td>{bookingDetails.passenger_email}</td>
                    </tr>
                    <tr>
                      <td><strong>Nomor Telepon</strong></td>
                      <td>{bookingDetails.passenger_phone}</td>
                    </tr>
                    <tr>
                      <td><strong>Maskapai</strong></td>
                      <td>{segment.carrierCode} - {segment.number}</td>
                    </tr>
                    <tr>
                      <td><strong>Rute</strong></td>
                      <td>{searchParams.origin} → {searchParams.destination}</td>
                    </tr>
                    <tr>
                      <td><strong>Keberangkatan</strong></td>
                      <td>{formatDateTime(segment.departure.at)}</td>
                    </tr>
                    <tr>
                      <td><strong>Total Harga</strong></td>
                      <td><strong className="text-success fs-5">{formatPrice(flight.price.total)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                    <i className="bi bi-house-fill me-2"></i>
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <h3 className="text-white mb-0">
                <i className="bi bi-clipboard-fill me-2"></i>
                Form Booking Penerbangan
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="alert alert-info mb-4">
                <h5>Detail Penerbangan</h5>
                <p className="mb-1"><strong>Maskapai:</strong> {segment.carrierCode} - {segment.number}</p>
                <p className="mb-1"><strong>Rute:</strong> {searchParams.origin} → {searchParams.destination}</p>
                <p className="mb-1"><strong>Keberangkatan:</strong> {formatDateTime(segment.departure.at)}</p>
                <p className="mb-0"><strong>Total Harga:</strong> <span className="text-success fw-bold">{formatPrice(flight.price.total)}</span></p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person-fill me-2"></i>Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="passenger_name"
                    value={formData.passenger_name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap sesuai KTP/Paspor"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope-fill me-2"></i>Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="passenger_email"
                    value={formData.passenger_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-telephone-fill me-2"></i>Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    name="passenger_phone"
                    value={formData.passenger_phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Memproses booking...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Konfirmasi Booking
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Kembali
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
