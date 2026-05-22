CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(3) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    age INT NOT NULL CHECK (age >= 18 AND age <= 60),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,
    last_donation_date DATE,
    has_diseases BOOLEAN NOT NULL DEFAULT FALSE,
    tattoo_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_last_donation ON donors(last_donation_date);
