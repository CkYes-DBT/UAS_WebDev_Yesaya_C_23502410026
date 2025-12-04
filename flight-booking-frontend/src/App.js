import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchFlight from './components/SearchFlight';
import FlightResults from './components/FlightResults';
import BookingForm from './components/BookingForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchFlight />} />
          <Route path="/results" element={<FlightResults />} />
          <Route path="/booking" element={<BookingForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
