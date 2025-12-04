const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GoPass API',
    version: '1.0.0',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
