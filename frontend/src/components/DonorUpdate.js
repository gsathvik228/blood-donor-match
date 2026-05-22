import React, { useState, useEffect } from 'react';
import { INDIAN_CITIES } from '../constants';

function DonorUpdate() {
  const [step, setStep] = useState('lookup');
  const [donorId, setDonorId] = useState('');
  const [donor, setDonor] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const lookupDonor = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/donors/${donorId}`);
      const data = await res.json();

      if (data.success) {
        setDonor(data.donor);
        setForm({
          name: data.donor.name,
          age: data.donor.age,
          phone: data.donor.phone,
          email: data.donor.email,
          city: data.donor.city,
          full_address: data.donor.full_address,
          last_donation_date: data.donor.last_donation_date
            ? data.donor.last_donation_date.split('T')[0]
            : '',
        });
        setStep('update');
      } else {
        setMessage({ type: 'error', text: data.errors.join(' ') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
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
    for (const key of ['name', 'age', 'phone', 'email', 'city', 'full_address', 'last_donation_date']) {
      if (form[key] !== String(donor[key] || '')) {
        body[key] = form[key];
      }
    }

    if (Object.keys(body).length === 0) {
      setMessage({ type: 'error', text: 'No changes detected.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/donors/${donorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Details updated successfully!' });
        setDonor(data.donor);
        setForm({
          name: data.donor.name,
          age: data.donor.age,
          phone: data.donor.phone,
          email: data.donor.email,
          city: data.donor.city,
          full_address: data.donor.full_address,
          last_donation_date: data.donor.last_donation_date
            ? data.donor.last_donation_date.split('T')[0]
            : '',
        });
      } else {
        setMessage({ type: 'error', text: data.errors.join(' ') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'lookup') {
    return (
      <div className="card">
        <h2>Update Donor Details</h2>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <p style={{ marginBottom: '1rem' }}>
          Enter your Donor ID to update your details. Note: blood group cannot
          be changed.
        </p>

        <form onSubmit={lookupDonor}>
          <div className="form-group">
            <label>Donor ID</label>
            <input
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
              required
              placeholder="Enter your donor ID"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Looking up...' : 'Find My Details'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Update Donor Details</h2>
      <p>
        Donor ID: <strong>{donor.id}</strong> &mdash; Blood Group:{' '}
        <strong>{donor.blood_group}</strong> (cannot be changed)
      </p>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
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
            <label>Full Address</label>
            <textarea name="full_address" value={form.full_address} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Latest Blood Donation Date</label>
          <input
            name="last_donation_date"
            type="date"
            value={form.last_donation_date}
            onChange={handleChange}
          />
          <div className="hint">
            Update this after each donation. Donors cannot donate again within 6 months.
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Details'}
        </button>

        <button
          type="button"
          className="btn"
          style={{ marginLeft: '0.5rem', background: '#95a5a6', color: '#fff' }}
          onClick={() => setStep('lookup')}
        >
          Back
        </button>
      </form>
    </div>
  );
}

export default DonorUpdate;
