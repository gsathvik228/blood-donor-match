require('dotenv').config();
const express = require('express');
const cors = require('cors');
const donorsRouter = require('./routes/donors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blood Donor API is running' });
});

app.use('/api/donors', donorsRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, errors: ['Internal server error'] });
});

app.listen(PORT, () => {
  console.log(`Blood Donor API server running on port ${PORT}`);
});
