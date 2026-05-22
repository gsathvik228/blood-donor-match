import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function SignInSignUp() {
  const [mode, setMode] = useState('signin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user, data.donor);
        navigate(from, { replace: true });
      } else {
        setError(data.errors.join(' '));
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <div className="card auth-card">
      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => switchMode()}
          disabled={mode === 'signin'}
        >
          Sign In
        </button>
        <button
          className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => switchMode()}
          disabled={mode === 'signup'}
        >
          Sign Up
        </button>
      </div>

      <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        {mode === 'signin'
          ? 'Sign in to register as a donor or search for donors.'
          : 'Create an account to get started. After signing up, you can register as a donor.'}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number <span className="required">*</span></label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="e.g. +91 9876543210"
          />
        </div>
        <div className="form-group">
          <label>Password <span className="required">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading
            ? 'Please wait...'
            : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        {mode === 'signin' ? (
          <>Don't have an account? <button className="link-btn" onClick={() => { setMode('signup'); setError(null); }}>Sign Up</button></>
        ) : (
          <>Already have an account? <button className="link-btn" onClick={() => { setMode('signin'); setError(null); }}>Sign In</button></>
        )}
      </p>
    </div>
  );
}

export default SignInSignUp;
