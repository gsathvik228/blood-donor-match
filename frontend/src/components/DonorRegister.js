import React, { useState } from 'react';
import { BLOOD_GROUPS, INDIAN_CITIES } from '../constants';

function DonorRegister() {
  const [form, setForm] = useState({
    name: '',
    blood_group: '',
    age: '',
    phone: '',
    email: '',
    city: '',
    full_address: '',
    tattoo_date: '',
    has_tattoo: 'no',
    confirm_no_diseases: false,
    confirm_blood_group: false,
    confirm_eligibility: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [donorId, setDonorId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.confirm_eligibility) {
      setMessage({ type: 'error', text: 'You must confirm you meet the eligibility criteria.' });
      return;
    }

    if (!form.confirm_no_diseases) {
      setMessage({ type: 'error', text: 'You must confirm you have no history of blood-related diseases.' });
      return;
    }

    if (!form.confirm_blood_group) {
      setMessage({ type: 'error', text: 'You must confirm that your blood group is correct and cannot be changed later.' });
      return;
    }

    setLoading(true);

    const body = {
      name: form.name,
      blood_group: form.blood_group,
      age: parseInt(form.age),
      phone: form.phone,
      email: form.email,
      city: form.city,
      full_address: form.full_address,
      has_diseases: false,
    };

    if (form.has_tattoo === 'yes') {
      body.tattoo_date = form.tattoo_date;
    }

    try {
      const res = await fetch('/api/donors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Registration successful! Your donor ID is: ' + data.donor.id });
        setDonorId(data.donor.id);
        setForm({
          name: '', blood_group: '', age: '', phone: '', email: '',
          city: '', full_address: '', tattoo_date: '', has_tattoo: 'no',
          confirm_no_diseases: false, confirm_blood_group: false, confirm_eligibility: false,
        });
      } else {
        setMessage({ type: 'error', text: data.errors.join(' ') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to server. Please ensure the backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register as a Blood Donor</h2>

      <div className="disclaimer">
        <strong>Important:</strong> Your blood group will be recorded as final
        and <strong>cannot be changed</strong> after registration. Please verify
        your blood group carefully before submitting.
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {donorId && (
        <div className="alert alert-info">
          Save your Donor ID (<strong>{donorId}</strong>) &mdash; you will need
          it to update your details in the future.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Doe" />
          </div>
          <div className="form-group">
            <label>Blood Group</label>
            <select name="blood_group" value={form.blood_group} onChange={handleChange} required>
              <option value="">-- Select --</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} required min="18" max="60" />
            <div className="hint">Must be between 18 and 60 years old</div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. +91 9876543210" />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="e.g. john@example.com" />
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
            <textarea name="full_address" value={form.full_address} onChange={handleChange} required placeholder="Street, locality, landmark..." />
          </div>
        </div>

        <div className="form-group">
          <label>Do you have any tattoos?</label>
          <select name="has_tattoo" value={form.has_tattoo} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {form.has_tattoo === 'yes' && (
          <div className="form-group">
            <label>Date of most recent tattoo</label>
            <input name="tattoo_date" type="date" value={form.tattoo_date} onChange={handleChange} required />
            <div className="hint">Must be at least 1 year ago to be eligible</div>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="confirm_eligibility"
              checked={form.confirm_eligibility}
              onChange={handleChange}
            />
            {' '}I confirm that I meet the eligibility criteria (age 18&ndash;60, no disqualifying conditions)
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="confirm_no_diseases"
              checked={form.confirm_no_diseases}
              onChange={handleChange}
            />
            {' '}I confirm that I have no history of blood-related diseases
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="confirm_blood_group"
              checked={form.confirm_blood_group}
              onChange={handleChange}
            />
            {' '}I understand that my blood group is <strong>final and cannot be changed</strong> after registration
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register as Donor'}
        </button>
      </form>
    </div>
  );
}

export default DonorRegister;
