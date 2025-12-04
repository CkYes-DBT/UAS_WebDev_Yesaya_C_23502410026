import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchFlight = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    adults: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

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
      const response = await axios.post('http://localhost:8000/api/search/', formData);
      
      if (response.data.success) {
        navigate('/results', { 
          state: { 
            flights: response.data.flights,
            searchParams: {
              origin: response.data.origin,
              destination: response.data.destination,
              departure_date: response.data.departure_date
            }
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mencari penerbangan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}>
            <div className="card-body p-5">
              <h2 className="text-white text-center mb-4">
                <i className="bi bi-airplane-fill me-2"></i>
                Cari Penerbangan
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white">
                    <i className="bi bi-geo-alt-fill me-2"></i>Dari (Kota/Kode Bandara)
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Jakarta, CGK, Bali, dll"
                    required
                  />
                  <small className="text-white-50">Contoh: Jakarta, Bali, CGK, DPS</small>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">
                    <i className="bi bi-geo-fill me-2"></i>Ke (Kota/Kode Bandara)
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Singapore, Bangkok, SIN, BKK, dll"
                    required
                  />
                  <small className="text-white-50">Contoh: Singapore, Bangkok, SIN, BKK</small>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">
                    <i className="bi bi-calendar-fill me-2"></i>Tanggal Keberangkatan
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white">
                    <i className="bi bi-person-fill me-2"></i>Jumlah Penumpang
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>{num} Orang</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-light btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Mencari penerbangan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Cari Penerbangan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFlight;
