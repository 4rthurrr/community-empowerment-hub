require('dotenv').config();
const Stripe = require('stripe');

// Initialize Stripe with the secret key
const initStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    console.error('Missing STRIPE_SECRET_KEY in environment variables');
    throw new Error('Stripe configuration error: API key is missing');
  }
  
  return new Stripe(apiKey);
};

module.exports = { initStripe };
