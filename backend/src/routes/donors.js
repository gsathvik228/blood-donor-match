const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { validateDonorRegistration, validateDonorUpdate } = require('../middleware/validation');

router.post('/register', validateDonorRegistration, async (req, res) => {
  try {
    const { name, blood_group, age, phone, email, city, full_address, tattoo_date } = req.body;

    const result = await db.query(
      `INSERT INTO donors (name, blood_group, age, phone, email, city, full_address, has_diseases, tattoo_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8)
       RETURNING id, name, blood_group, age, phone, email, city, created_at`,
      [name.trim(), blood_group.toUpperCase(), parseInt(age), phone.trim(), email.trim().toLowerCase(), city.trim(), full_address.trim(), tattoo_date || null]
    );

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully. Your blood group is final and cannot be changed.',
      donor: result.rows[0],
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, errors: ['Server error during registration'] });
  }
});

router.put('/:id', validateDonorUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, phone, email, city, full_address, last_donation_date } = req.body;

    const existing = await db.query('SELECT * FROM donors WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, errors: ['Donor not found'] });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name.trim()); }
    if (age !== undefined) { fields.push(`age = $${idx++}`); values.push(parseInt(age)); }
    if (phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(phone.trim()); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email.trim().toLowerCase()); }
    if (city !== undefined) { fields.push(`city = $${idx++}`); values.push(city.trim()); }
    if (full_address !== undefined) { fields.push(`full_address = $${idx++}`); values.push(full_address.trim()); }
    if (last_donation_date !== undefined) { fields.push(`last_donation_date = $${idx++}`); values.push(last_donation_date); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, errors: ['No fields to update'] });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await db.query(
      `UPDATE donors SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, blood_group, age, phone, email, city, last_donation_date, updated_at`,
      values
    );

    res.json({
      success: true,
      message: 'Donor details updated successfully',
      donor: result.rows[0],
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, errors: ['Server error during update'] });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { blood_group, city } = req.query;

    if (!blood_group || !city) {
      return res.status(400).json({
        success: false,
        errors: ['Blood group and city are required for search'],
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db.query(
      `SELECT id, name, phone, last_donation_date
       FROM donors
       WHERE blood_group = $1
         AND LOWER(city) = LOWER($2)
         AND (last_donation_date IS NULL OR last_donation_date <= $3)
       ORDER BY name`,
      [blood_group.toUpperCase(), city, sixMonthsAgo.toISOString().split('T')[0]]
    );

    res.json({
      success: true,
      count: result.rows.length,
      donors: result.rows,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, errors: ['Server error during search'] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, name, blood_group, age, phone, email, city, full_address, last_donation_date, created_at, updated_at FROM donors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, errors: ['Donor not found'] });
    }

    res.json({ success: true, donor: result.rows[0] });
  } catch (err) {
    console.error('Get donor error:', err);
    res.status(500).json({ success: false, errors: ['Server error'] });
  }
});

module.exports = router;
