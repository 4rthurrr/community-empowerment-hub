// This file serves as an entry point for Vercel serverless functions
// It imports your Express app from the server folder
const app = require('../server/server');

// Export the Express app as a serverless function
module.exports = app;