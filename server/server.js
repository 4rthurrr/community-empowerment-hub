require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require('./utils/dbConnect');

// Routes imports
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopPortfolioRouter = require("./routes/shop/portfolio-routes");

// Import job portal routes
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRouter = require('./routes/userRoutes');

// Import models
const Portfolio = require('./models/Portfolio');

console.log("Connecting to MongoDB...");

// Use our new dbConnect helper in serverless environments
if (process.env.NODE_ENV === 'production') {
  // In production, we'll connect on-demand in our API routes
  console.log("Production environment detected - will connect to MongoDB as needed");
} else {
  // In development, connect immediately
  dbConnect()
    .then(() => console.log("MongoDB connected in development mode"))
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS configuration to work with Vercel
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://community-empowerment-hub.vercel.app', 
          'https://community-empowerment-hub-git-main.vercel.app',
          new RegExp(`https://community-empowerment-hub-.*\\.vercel\\.app`)
        ]
      : "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// In server.js (temporary test)
app.get('/api/verify', async (req, res) => {
  try {
    // Connect to MongoDB in serverless environment
    if (process.env.NODE_ENV === 'production') {
      await dbConnect();
    }
    
    const count = await Portfolio.countDocuments();
    res.json({ 
      database: "test",
      collection: "portfolios",
      document_count: count,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Verify endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use(cookieParser());
app.use(express.json());
// Add this before route middlewares
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Route middlewares
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/portfolio", shopPortfolioRouter);

// Apply job portal routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/user', userRouter);

app.use("/api/reviews", require("./routes/shop/review-routes"));

// Export for Vercel serverless function
module.exports = app;

// Only listen directly when not imported by Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
}