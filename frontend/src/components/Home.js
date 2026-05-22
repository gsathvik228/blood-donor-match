import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Save Lives. Donate Blood.</h1>
        <p>
          A public platform connecting blood donors with recipients in critical
          situations. Fast, anonymous, and free.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary">
            Register as Donor
          </Link>
          <Link
            to="/search"
            className="btn btn-primary"
            style={{ background: '#2980b9' }}
          >
            Find a Donor
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Eligibility Checked</h3>
          <p>
            Donors must be 18&ndash;60 years old, free from diseases, and
            meet tattoo and donation interval guidelines.
          </p>
        </div>
        <div className="feature-card">
          <h3>Anonymous Until Contact</h3>
          <p>
            Your address and full details stay private until a recipient
            reaches out to you directly.
          </p>
        </div>
        <div className="feature-card">
          <h3>Smart Matching</h3>
          <p>
            Search by blood group and city. Donors who donated within the
            last 6 months are automatically hidden.
          </p>
        </div>
        <div className="feature-card">
          <h3>For Recipients</h3>
          <p>
            Find donors near your location with the blood group you need.
            Contact them directly to arrange donation.
          </p>
        </div>
        <div className="feature-card">
          <h3>For Donors</h3>
          <p>
            Register once, update your last donation date, and keep your
            profile active. Your blood group is permanent after registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
