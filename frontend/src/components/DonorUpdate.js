import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { INDIAN_CITIES, INDIAN_STATES } from '../constants';

function DonorUpdate() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/donors/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const d = data.donor;
        setForm({
          name: d.name || '',
          age: d.age || '',
          phone: d.phone || '',
          email: d.email || '',
          city: d.city || '',
          state: d.state || '',
          full_address: d.full_address || '',
          last_donation_date: d.last_donation_date ? d.last_donation_date.split('T')[0] : '',
        });
      } else {
        logout();
        navigate('/login');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile.' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const body = {};
    for (const key of ['name', 'age', 'phone', 'email', 'city', 'state', 'full_address', 'last_donation_date']) {
      if (form[key] !== String(user[key] || '')) {
        body[key] = form[key];
      }
    }

    if (Object.keys(body).length === 0) {
      setMessage({ type: 'error', text: 'No changes detected.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/donors/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Details updated successfully!' });
        fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.errors.join(' ') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>My Donor Profile</h2>
      <p>
        Donor ID: <strong>{user.id}</strong> &mdash; Blood Group:{' '}
        <strong>{user.blood_group}</strong> (cannot be changed)
      </p>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginTop: '1rem' }}>{message.text}</div>
      )}

      <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} required min="18" max="60" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <select name="city" value={form.city} onChange={handleChange} required>
              <option value="">-- Select City --</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>State</label>
            <select name="state" value={form.state} onChange={handleChange} required>
              <option value="">-- Select State --</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Full Address</label>
          <textarea name="full_address" value={form.full_address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Latest Blood Donation Date</label>
          <input name="last_donation_date" type="date" value={form.last_donation_date} onChange={handleChange} />
          <div className="hint">Update this after each donation. Donors cannot donate again within 6 months.</div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default DonorUpdate;
