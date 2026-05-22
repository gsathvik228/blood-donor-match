import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { BLOOD_GROUPS, INDIAN_CITIES } from '../constants';

function DonorSearch() {
  const { token } = useAuth();
  const [blood_group, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [matchType, setMatchType] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setDonors([]);
    setSearched(false);
    setMatchType(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/donors/search?blood_group=${encodeURIComponent(blood_group)}&city=${encodeURIComponent(city)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setDonors(data.donors);
        setCount(data.count);
        setMatchType(data.match_type);
        if (data.message) setInfoMessage(data.message);
      } else {
        setError(data.errors.join(' '));
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="card">
      <h2>Find Blood Donors</h2>
      <p style={{ marginBottom: '1rem' }}>
        Search for available donors in your area. Donors who donated within the
        last 6 months are automatically hidden. If no donors are found in your
        city, results will expand nationwide.
      </p>

      <form onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label>Blood Group Needed <span className="required">*</span></label>
            <select value={blood_group} onChange={(e) => setBloodGroup(e.target.value)} required>
              <option value="">-- Select --</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City / Region <span className="required">*</span></label>
            <select value={city} onChange={(e) => setCity(e.target.value)} required>
              <option value="">-- Select City --</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Donors'}
        </button>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {searched && !error && (
        <div style={{ marginTop: '1.5rem' }}>
          {matchType === 'exact' && (
            <h3>Found {count} donor{count > 1 ? 's' : ''} in {city}</h3>
          )}

          {matchType === 'nationwide' && infoMessage && (
            <>
              <div className="alert alert-info">{infoMessage}</div>
              <h3>Showing {count} donor{count > 1 ? 's' : ''} across India</h3>
            </>
          )}

          {matchType === 'none' && infoMessage && (
            <div className="alert alert-error">{infoMessage}</div>
          )}

          {donors.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div className="alert alert-info">
                Contact these donors directly to arrange blood donation.
                Their full address is kept private until you reach out.
              </div>
              {donors.map((donor) => (
                <div key={donor.id} className="donor-card">
                  <div className="donor-card-header">
                    <h4>{donor.name}</h4>
                    {donor.city && <span className="donor-location">{donor.city}{donor.state ? `, ${donor.state}` : ''}</span>}
                  </div>
                  <p><strong>Phone:</strong> {donor.phone}</p>
                  <p>
                    <strong>Last Donation:</strong>{' '}
                    {donor.last_donation_date
                      ? new Date(donor.last_donation_date).toLocaleDateString()
                      : 'Never donated'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DonorSearch;
