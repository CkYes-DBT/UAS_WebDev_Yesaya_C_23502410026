import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchFlight = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
    trip_type: 'round-trip',
    adults: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  // Load search history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveToHistory = (searchData, flights) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newEntry = {
      ...searchData,
      flights: flights,
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...history].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    setSearchHistory(updated.slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        return_date: formData.return_date || null
      };
      
      const response = await axios.post('http://localhost:8000/api/search/', submitData);
      
      if (response.data.success) {
        saveToHistory({
          origin: response.data.origin,
          destination: response.data.destination,
          departure_date: response.data.departure_date,
          trip_type: response.data.trip_type
        }, response.data.flights);

        navigate('/results', { 
          state: { 
            flights: response.data.flights,
            searchParams: {
              ...response.data,
              adults: formData.adults
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

  const swapLocations = () => {
    setFormData({
      ...formData,
      origin: formData.destination,
      destination: formData.origin
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(180deg, #1a1d4a 0%, #2d3561 50%, #4a5578 100%)'
    }}>
      <div className="container py-4">
        {/* Header */}
        <h1 className="text-white fw-bold mb-4">
          <i className="bi bi-airplane-engines-fill me-2"></i>
          Flights
        </h1>

        {/* Main Search Card */}
        <div className="card shadow-lg border-0 rounded-4 mb-4">
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Trip Type Radio Buttons */}
              <div className="mb-4">
                <div className="btn-group" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="trip_type"
                    id="round-trip"
                    value="round-trip"
                    checked={formData.trip_type === 'round-trip'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary" htmlFor="round-trip">
                    <i className="bi bi-arrow-left-right me-2"></i>
                    Round-trip
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="trip_type"
                    id="one-way"
                    value="one-way"
                    checked={formData.trip_type === 'one-way'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary" htmlFor="one-way">
                    <i className="bi bi-arrow-right me-2"></i>
                    One-way
                  </label>
                </div>
              </div>

              {/* Search Fields */}
              <div className="row g-3">
                {/* Origin & Destination */}
                <div className="col-md-6">
                  <div className="position-relative">
                    <label className="form-label text-muted small">Leaving from</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      placeholder="City or airport"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                      onClick={swapLocations}
                      style={{ marginTop: '12px' }}
                    >
                      <i className="bi bi-arrow-left-right text-primary fs-5"></i>
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small">Going to</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="City or airport"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="col-md-4">
                  <label className="form-label text-muted small">Departure</label>
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

                {formData.trip_type === 'round-trip' && (
                  <div className="col-md-4">
                    <label className="form-label text-muted small">Return</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="return_date"
                      value={formData.return_date}
                      onChange={handleChange}
                      min={formData.departure_date || today}
                      required={formData.trip_type === 'round-trip'}
                    />
                  </div>
                )}

                {/* Passengers */}
                <div className={formData.trip_type === 'round-trip' ? 'col-md-4' : 'col-md-8'}>
                  <label className="form-label text-muted small">
                    <i className="bi bi-person-fill me-2"></i>
                    Passengers
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>{num} adult{num > 1 ? 's' : ''} · Economy</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="row mt-4">
                <div className="col-md-8"></div>
                <div className="col-md-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Recent Searches</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearHistory}
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear All
                </button>
              </div>
              <div className="list-group list-group-flush">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className="list-group-item list-group-item-action border-0 px-0"
                    onClick={() => {
                      // Fill the form with history data
                      setFormData({
                        ...formData,
                        origin: item.origin,
                        destination: item.destination,
                        departure_date: item.departure_date,
                        trip_type: item.trip_type
                      });
                      
                      // If flights are saved, navigate to results
                      if (item.flights && item.flights.length > 0) {
                        navigate('/results', {
                          state: {
                            flights: item.flights,
                            searchParams: {
                              origin: item.origin,
                              destination: item.destination,
                              departure_date: item.departure_date,
                              trip_type: item.trip_type,
                              adults: formData.adults
                            }
                          }
                        });
                      }
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-clock-history me-2 text-muted"></i>
                        <strong>{item.origin}</strong>
                        <i className="bi bi-arrow-right mx-2 text-muted"></i>
                        <strong>{item.destination}</strong>
                        <span className="ms-3 text-muted small">
                          {new Date(item.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="badge bg-light text-dark">{item.trip_type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFlight;
