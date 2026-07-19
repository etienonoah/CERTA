require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorHandler, catchAsync } = require('./middleware/errorHandler');
const { validate, schemas } = require('./middleware/validate');
const { authMiddleware, JWT_SECRET } = require('./middleware/auth');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- Database Connections ---

// MongoDB Connection (for unstructured data, logs, or AI models output)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farm2market')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema for AI Matches (since it might be unstructured/document based)
const matchSchema = new mongoose.Schema({
  listing_id: Number,
  buyer_id: Number,
  match_score: Number,
  ai_confidence: Number,
  factors: Object,
  created_at: { type: Date, default: Date.now }
});
const MatchModel = mongoose.model('Match', matchSchema);

// --- Core API Endpoints (PostgreSQL/SQLite) ---

app.get('/health', catchAsync(async (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}));

// Auth: Register
app.post('/register', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const [id] = await knex('users').insert({ email, password: hashedPassword }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'User registered successfully' });
}));

// Auth: Login
app.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await knex('users').where({ email }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, message: 'Login successful' });
}));

// 1. Farmers
app.post('/farmers', validate(schemas.farmerSchema), catchAsync(async (req, res) => {
  const { name, contact_info } = req.body;
  const [id] = await knex('farmers').insert({ name, contact_info }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'Farmer created' });
}));

app.get('/farmers', catchAsync(async (req, res) => {
  const farmers = await knex('farmers').select('*');
  res.json(farmers);
}));

// 2. Listings (Protected)
app.post('/listings', authMiddleware, validate(schemas.listingSchema), catchAsync(async (req, res) => {
  const { farmer_id, crop_type, quantity, estimated_harvest_window } = req.body;
  const [id] = await knex('listings').insert({ 
    farmer_id, crop_type, quantity, estimated_harvest_window 
  }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'Listing created' });
}));

app.get('/listings', catchAsync(async (req, res) => {
  const listings = await knex('listings').select('*');
  res.json(listings);
}));

// 3. Warehouses
app.post('/warehouses', validate(schemas.warehouseSchema), catchAsync(async (req, res) => {
  const { name, location, capacity } = req.body;
  const [id] = await knex('warehouses').insert({ name, location, capacity }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'Warehouse created' });
}));

app.get('/warehouses', catchAsync(async (req, res) => {
  const warehouses = await knex('warehouses').select('*');
  res.json(warehouses);
}));

// 4. Warehouse Availability
app.get('/warehouses/:id/availability', catchAsync(async (req, res) => {
  const { id } = req.params;
  const warehouse = await knex('warehouses').where({ id }).first();
  if (!warehouse) {
    const error = new Error('Warehouse not found');
    error.status = 404;
    throw error;
  }

  // Calculate booked capacity
  const bookings = await knex('bookings')
    .where({ warehouse_id: id })
    .whereIn('status', ['confirmed', 'stored']);
  
  // Simplification: each booking uses 1 capacity unit, or sum of listing quantities
  const booked_capacity = bookings.length;
  const available_capacity = warehouse.capacity - booked_capacity;

  res.json({ warehouse_id: id, available_capacity, total_capacity: warehouse.capacity });
}));

// 5. Pre-orders (Consumer Reservation) - Protected
app.post('/preorders', authMiddleware, validate(schemas.preorderSchema), catchAsync(async (req, res) => {
  const { consumer_id, listing_id } = req.body;
  // Status defaults to 'reserved', stubbed harvest_window
  const [id] = await knex('preorders').insert({
    consumer_id,
    listing_id,
    status: 'reserved',
    harvest_window: 'STUB: Q3 2026' // Placeholder for Data Science output
  }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'Preorder created', status: 'reserved' });
}));

// 6. Bookings (Warehouse Reservations)
app.post('/bookings', validate(schemas.bookingSchema), catchAsync(async (req, res) => {
  const { warehouse_id, listing_id } = req.body;
  const [id] = await knex('bookings').insert({
    warehouse_id,
    listing_id,
    status: 'requested'
  }).returning('id');
  res.status(201).json({ id: id.id || id, message: 'Booking requested', status: 'requested' });
}));

// 7. Booking Status Transitions
app.put('/bookings/:id/status', validate(schemas.bookingStatusSchema), catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Valid states: requested -> confirmed -> stored -> released
  const validStates = ['requested', 'confirmed', 'stored', 'released'];
  if (!validStates.includes(status)) {
    const error = new Error('Invalid status transition');
    error.status = 400;
    throw error;
  }

  await knex('bookings').where({ id }).update({ status });
  res.json({ id, status, message: `Booking status updated to ${status}` });
}));

// 8. AI/ML Buyer Matching (MongoDB + PostgreSQL hybrid)
app.post('/matches', validate(schemas.matchSchema), catchAsync(async (req, res) => {
  const { listing_id } = req.body;
  
  // Simulate AI match generation
  const mock_buyer_id = 1;
  const mock_score = 0.95;

  // Save structured relation to PostgreSQL
  const [matchId] = await knex('matches').insert({
    listing_id,
    buyer_id: mock_buyer_id,
    match_score: mock_score
  }).returning('id');

  // Save unstructured AI metadata to MongoDB
  const aiMatchData = new MatchModel({
    listing_id,
    buyer_id: mock_buyer_id,
    match_score: mock_score,
    ai_confidence: 0.99,
    factors: { location: 'close', crop_match: true }
  });
  await aiMatchData.save();

  res.status(201).json({ 
    id: matchId.id || matchId, 
    message: 'Match generated',
    ai_data_id: aiMatchData._id
  });
}));

// 9. AI Prediction Endpoint (Spoilage Risk & Farmer Clustering)
app.post('/ai/predict', authMiddleware, validate(schemas.aiPredictSchema), catchAsync(async (req, res) => {
  // Call the external Python microservice
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000/predict';
  
  const aiResponse = await axios.post(aiServiceUrl, req.body);
  
  res.json({
    message: 'AI prediction successful',
    prediction: aiResponse.data
  });
}));

// Register Global Error Handler at the very end
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
