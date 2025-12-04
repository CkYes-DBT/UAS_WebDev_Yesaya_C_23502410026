import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchParams } = location.state || {};
  
  const [contactData, setContactData] = useState({
    email: '',
    phone: ''
  });

  const [passengers, setPassengers] = useState(
    Array.from({ length: searchParams?.adults || 1 }, () => ({
      first_name: '',
      last_name: '',
      passport_number: '',
      birth_date: '',
      gender: 'male'
    }))
  );

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

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine first passenger data for the API
      const response = await axios.post('http://localhost:8000/api/booking/', {
        flight_id: flight.id,
        passenger_name: `${passengers[0].first_name} ${passengers[0].last_name}`,
        passenger_email: contactData.email,
        passenger_phone: contactData.phone,
        passport_number: passengers[0].passport_number
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
                      <td><strong>Email</strong></td>
                      <td>{bookingDetails.passenger_email}</td>
                    </tr>
                    <tr>
                      <td><strong>Nomor Telepon</strong></td>
                      <td>{bookingDetails.passenger_phone}</td>
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
    <div className="container my-5">
      <button className="btn btn-link text-decoration-none mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>
        Kembali
      </button>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom">
              <h4 className="mb-0">Lengkapi Data Pemesanan</h4>
              <p className="text-muted mb-0 small">Isi data penumpang sesuai identitas resmi</p>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Contact Data */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <span className="badge bg-primary me-2">1</span>
                    Data Pemesan
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">EMAIL</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={contactData.email}
                        onChange={handleContactChange}
                        placeholder="akupadamu@gmail.com"
                        required
                      />
                      <small className="text-muted">E-tiket akan dikirim ke sini</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small">NOMOR TELEPON</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={contactData.phone}
                        onChange={handleContactChange}
                        placeholder="12345678910"
                        required
                      />
                      <small className="text-muted">Untuk notifikasi penting</small>
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                {passengers.map((passenger, index) => (
                  <div key={index} className="mb-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <span className="badge bg-primary me-2">{index + 2}</span>
                      Penumpang {index + 1}
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">NAMA DEPAN</label>
                        <input
                          type="text"
                          className="form-control"
                          value={passenger.first_name}
                          onChange={(e) => handlePassengerChange(index, 'first_name', e.target.value)}
                          placeholder="Noel"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">NAMA BELAKANG</label>
                        <input
                          type="text"
                          className="form-control"
                          value={passenger.last_name}
                          onChange={(e) => handlePassengerChange(index, 'last_name', e.target.value)}
                          placeholder="Kresna"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">NOMOR PASPOR</label>
                        <input
                          type="text"
                          className="form-control"
                          value={passenger.passport_number}
                          onChange={(e) => handlePassengerChange(index, 'passport_number', e.target.value)}
                          placeholder="AD91739"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">TANGGAL LAHIR</label>
                        <input
                          type="date"
                          className="form-control"
                          value={passenger.birth_date}
                          onChange={(e) => handlePassengerChange(index, 'birth_date', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small">JENIS KELAMIN</label>
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`gender_${index}`}
                              id={`male_${index}`}
                              value="male"
                              checked={passenger.gender === 'male'}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            />
                            <label className="form-check-label" htmlFor={`male_${index}`}>
                              Laki-laki
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`gender_${index}`}
                              id={`female_${index}`}
                              value="female"
                              checked={passenger.gender === 'female'}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            />
                            <label className="form-check-label" htmlFor={`female_${index}`}>
                              Perempuan
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Memproses...
                      </>
                    ) : (
                      'Lanjut ke Pembayaran'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <div className="card-body p-4">
              <h5 className="mb-3">Ringkasan Pemesanan</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Rute</span>
                  <strong>{searchParams.origin} → {searchParams.destination}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Keberangkatan</span>
                  <span>{formatDateTime(segment.departure.at)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Penumpang</span>
                  <span>{passengers.length} Orang</span>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Total Pembayaran</strong>
                <strong className="text-primary fs-5">{formatPrice(flight.price.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
