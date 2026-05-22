const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

function validateDonorRegistration(req, res, next) {
  const { name, blood_group, age, email, city, state, full_address, has_diseases, tattoo_date } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!blood_group || !BLOOD_GROUPS.includes(blood_group.toUpperCase())) {
    errors.push('Valid blood group is required');
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 60) {
    errors.push('Age must be between 18 and 60');
  }

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!city || city.trim().length < 1) {
    errors.push('City is required');
  }

  if (!state || !INDIAN_STATES.includes(state)) {
    errors.push('Valid state is required');
  }

  if (!full_address || full_address.trim().length < 5) {
    errors.push('Full address is required');
  }

  if (has_diseases === true) {
    errors.push('You cannot register as a donor if you have a history of diseases');
  }

  if (tattoo_date) {
    const tattooDate = new Date(tattoo_date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (tattooDate > oneYearAgo) {
      errors.push('Tattoos must have been administered at least one year ago');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

function validateDonorUpdate(req, res, next) {
  const updates = req.body;
  const errors = [];

  if (updates.blood_group) {
    errors.push('Blood group cannot be changed once registered');
  }

  if (updates.age) {
    const ageNum = parseInt(updates.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 60) {
      errors.push('Age must be between 18 and 60');
    }
  }

  if (updates.name && updates.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (updates.email && !updates.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (updates.last_donation_date) {
    const donationDate = new Date(updates.last_donation_date);
    if (isNaN(donationDate.getTime())) {
      errors.push('Invalid last donation date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateDonorRegistration, validateDonorUpdate };
