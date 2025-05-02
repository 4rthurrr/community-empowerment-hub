const Portfolio = require('../../models/Portfolio'); // Capital P

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    const groupedPortfolios = {
      topRated: portfolios.filter(p => p.category === 'topRated'),
      bestSelling: portfolios.filter(p => p.category === 'bestSelling'),
      specialCollection: portfolios.filter(p => p.category === 'specialCollection'),
    };
    res.json(groupedPortfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    const savedPortfolio = await newPortfolio.save();
    res.status(201).json(savedPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};