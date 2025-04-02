import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { businessRules } from './businessLogic';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AIBusinessAdvisorTool = () => {
  // State management
  const [formData, setFormData] = useState({
    businessName: '',
    productCategory: '',
    currentPricing: '',
    monthlyRevenue: '',
    primaryGoal: '',
    targetMarket: '',
    competitorUrls: '',
    platformsUsed: []
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);

  // Available platforms for selection
  const availablePlatforms = [
    'Daraz.lk', 'Kapruka', 'WOW.lk', 'Instagram', 
    'Facebook', 'TikTok', 'Own Website', 'Local Markets/Pola',
    'Pickme Food', 'ikman.lk'
  ];

  // Primary business goals options
  const businessGoals = [
    'Increase Revenue', 'Expand to New Markets', 
    'Optimize Pricing', 'Reduce Costs',
    'Build Brand Awareness', 'Export to Foreign Markets'
  ];

  // Product categories
  const productCategories = [
    'Handmade Crafts/Handicrafts', 'Digital Products', 'Food & Beverages',
    'Clothing & Batik', 'Tea Products', 'Spices & Condiments',
    'Ayurvedic Products', 'Jewelry & Gems', 'Coconut-based Products', 
    'Tourism Services', 'Other'
  ];

  // Load TensorFlow.js model
  useEffect(() => {
    async function loadModel() {
      try {
        setModelLoading(true);
        // Simple regression model to predict growth based on inputs
        const createdModel = tf.sequential();
        createdModel.add(tf.layers.dense({units: 12, inputShape: [8], activation: 'relu'}));
        createdModel.add(tf.layers.dense({units: 8, activation: 'relu'}));
        createdModel.add(tf.layers.dense({units: 4}));
        
        createdModel.compile({
          optimizer: tf.train.adam(),
          loss: 'meanSquaredError'
        });
        
        // Initialize with some reasonable weights
        // In a real implementation, you would load pre-trained weights
        await initializeModelWithSyntheticData(createdModel);
        
        setModel(createdModel);
        setModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelLoading(false);
      }
    }
    
    loadModel();
    
    return () => {
      // Cleanup if needed
      if (model) {
        try {
          model.dispose();
        } catch (e) {
          console.error('Error disposing model:', e);
        }
      }
    };
  }, []);
  
  // Initialize model with synthetic data for demonstration
  const initializeModelWithSyntheticData = async (model) => {
    // Create synthetic training data based on business logic
    const numSamples = 500;
    
    // Generate feature data (8 features)
    const inputData = Array.from({length: numSamples}, () => {
      return [
        Math.random(), // Category normalized
        Math.random() * 200, // Price
        Math.random() * 20000, // Revenue
        Math.random(), // Goal normalized
        Math.random(), // Target market size
        Math.random() * 5, // Num competitors
        Math.random(), // Platform usage normalized
        Math.random() // Market saturation
      ];
    });
    
    // Generate output data (4 outputs)
    const outputData = inputData.map(features => {
      // Apply business logic to generate realistic outputs
      const priceToRevenueRatio = features[1] / features[2];
      const marketSaturation = features[7];
      const platformDiversity = features[6];
      
      // Growth prediction
      const growth = 0.05 + 0.1 * (1 - priceToRevenueRatio) + 0.05 * platformDiversity - 0.1 * marketSaturation;
      
      // Price elasticity
      const priceElasticity = 0.8 + 0.4 * Math.random();
      
      // Optimal price change
      const optimalPriceChange = priceElasticity < 1 ? 0.15 : -0.05;
      
      // Market share potential
      const marketSharePotential = 0.05 + 0.1 * platformDiversity - 0.05 * marketSaturation;
      
      return [
        Math.max(0, Math.min(0.4, growth)), // Growth rate (0-40%)
        priceElasticity, // Price elasticity
        optimalPriceChange, // Recommended price change (-5% to +15%)
        marketSharePotential // Market share potential (0-15%)
      ];
    });
    
    // Convert to tensors
    const xs = tf.tensor2d(inputData);
    const ys = tf.tensor2d(outputData);
    
    // Train the model with synthetic data
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });
    
    // Clean up tensors
    xs.dispose();
    ys.dispose();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle checkbox changes for platforms
  const handlePlatformChange = (platform) => {
    const updatedPlatforms = formData.platformsUsed.includes(platform)
      ? formData.platformsUsed.filter(p => p !== platform)
      : [...formData.platformsUsed, platform];
    
    setFormData({
      ...formData,
      platformsUsed: updatedPlatforms
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.productCategory) {
      newErrors.productCategory = 'Please select a product category';
    }
    
    if (!formData.currentPricing.trim()) {
      newErrors.currentPricing = 'Current pricing is required';
    } else if (isNaN(parseFloat(formData.currentPricing))) {
      newErrors.currentPricing = 'Pricing must be a number';
    }
    
    if (!formData.monthlyRevenue.trim()) {
      newErrors.monthlyRevenue = 'Monthly revenue is required';
    } else if (isNaN(parseFloat(formData.monthlyRevenue))) {
      newErrors.monthlyRevenue = 'Revenue must be a number';
    }
    
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Please select a primary goal';
    }
    
    if (!formData.targetMarket.trim()) {
      newErrors.targetMarket = 'Target market information is required';
    }
    
    if (formData.platformsUsed.length === 0) {
      newErrors.platformsUsed = 'Please select at least one platform';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Generate real analysis with local ML model
        const results = await generateRealAnalysis();
        setAnalysisResults(results);
        setActiveTab('results');
      } catch (error) {
        console.error('Error generating analysis:', error);
        // Fallback to rule-based analysis if ML fails
        const fallbackResults = generateRuleBasedAnalysis();
        setAnalysisResults(fallbackResults);
        setActiveTab('results');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Process input data for the model
  const preprocessInput = () => {
    // Normalize categorical variables
    const categoryIdx = productCategories.indexOf(formData.productCategory) / productCategories.length;
    const goalIdx = businessGoals.indexOf(formData.primaryGoal) / businessGoals.length;
    
    // Extract numeric values
    const price = parseFloat(formData.currentPricing);
    const revenue = parseFloat(formData.monthlyRevenue);
    
    // Estimate market size from target market description (simple heuristic)
    const marketSize = formData.targetMarket.length / 100; // Simplistic proxy
    
    // Count competitors
    const competitorCount = formData.competitorUrls ? 
      formData.competitorUrls.split(',').length : 0;
    
    // Platform diversity score
    const platformDiversity = formData.platformsUsed.length / availablePlatforms.length;
    
    // Market saturation estimate (simplified)
    const marketSaturation = Math.min(competitorCount * 0.1, 1);
    
    return [
      categoryIdx,
      price,
      revenue,
      goalIdx,
      marketSize,
      competitorCount,
      platformDiversity,
      marketSaturation
    ];
  };

  // Generate analysis using the ML model
  const generateRealAnalysis = async () => {
    if (!model) {
      throw new Error('Model not loaded');
    }
    
    // Preprocess input data
    const processedInput = preprocessInput();
    
    // Make prediction with the model
    const inputTensor = tf.tensor2d([processedInput]);
    const prediction = model.predict(inputTensor);
    const predictionData = await prediction.data();
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();
    
    // Extract predictions
    const growthRate = predictionData[0];
    const priceElasticity = predictionData[1];
    const recommendedPriceChange = predictionData[2];
    const marketSharePotential = predictionData[3];
    
    // Apply business rules for recommendations based on ML predictions
    return businessLogicAnalysis(
      growthRate,
      priceElasticity,
      recommendedPriceChange,
      marketSharePotential
    );
  };
  
  // Apply business logic and rules to generate complete analysis
  const businessLogicAnalysis = (growthRate, priceElasticity, recommendedPriceChange, marketSharePotential) => {
    const price = parseFloat(formData.currentPricing);
    const monthlyRevenueNum = parseFloat(formData.monthlyRevenue);
    
    // --- FIX 1: Sanitize ML model outputs with reasonable boundaries ---
    // Ensure growth rate is within reasonable bounds
    const sanitizedGrowthRate = Math.max(-0.3, Math.min(0.5, growthRate));
    
    // Ensure price elasticity is within reasonable bounds
    const sanitizedPriceElasticity = Math.max(0.5, Math.min(2.0, priceElasticity));
    
    // Ensure price change is within reasonable bounds (max 50% increase or 30% decrease)
    const sanitizedPriceChange = Math.max(-0.3, Math.min(0.5, recommendedPriceChange));
    
    // Ensure market share potential is within reasonable bounds
    const sanitizedMarketSharePotential = Math.max(0.01, Math.min(0.2, marketSharePotential));
    
    // --- FIX 2: Apply reasonable price recommendations ---
    // Calculate recommended price based on elasticity and recommended change
    const pricingRecommendation = price * (1 + sanitizedPriceChange);
    
    // --- FIX 3: Ensure reasonable market share values ---
    // Calculate market share (assuming current is between 5-15% based on inputs)
    const currentMarketShare = 5 + Math.random() * 10; // Simplified estimate
    const potentialMarketShare = currentMarketShare + (sanitizedMarketSharePotential * 100);
    
    // --- FIX 4: Ensure growth percentage calculation doesn't result in NaN ---
    // Calculate 6-month revenue growth percentage (for executive summary)
    const sixMonthGrowthPercent = Math.round((Math.pow(1 + sanitizedGrowthRate, 0.5) - 1) * 100);
    
    // Generate seasonal trends based on product category
    const seasonalTrends = businessRules.generateSeasonalTrends(formData.productCategory);
    
    // Peak months based on actual seasonal data
    const peakMonths = seasonalTrends
      .filter(s => s.value > 110)
      .map(s => s.month)
      .join(' and ');
    
    // Generate competitor analysis
    const competitorAnalysis = businessRules.generateCompetitorAnalysis(
      currentMarketShare, 
      formData.productCategory,
      price
    );
    
    // --- FIX 5: Ensure revenue projections use sanitized growth rate ---
    // Generate financial projections based on growth rate
    const revenueData = businessRules.generateRevenueProjection(
      monthlyRevenueNum,
      sanitizedGrowthRate
    );
    
    // --- FIX 6: Ensure realistic profit margins ---
    // Calculate profit margins based on inputs and category
    // Categories like handicrafts tend to have higher margins than commodity products
    let baseProfitMargin = 25; // Default value
    
    if (formData.productCategory.includes('Handmade') || 
        formData.productCategory.includes('Jewelry') || 
        formData.productCategory.includes('Ayurvedic')) {
      baseProfitMargin = 35; // Higher margin categories
    } else if (formData.productCategory.includes('Electronics') || 
               formData.productCategory.includes('Food')) {
      baseProfitMargin = 20; // Lower margin categories
    }
    
    const currentProfitMargin = Math.round(baseProfitMargin + (Math.random() * 5 - 2.5));
    
    // Keep projected profit margin increase within realistic bounds (max 15% increase)
    const projectedProfitMargin = Math.round(
      currentProfitMargin + Math.min(15, Math.max(-10, sanitizedPriceChange * 100 * 0.7))
    );
    
    const industryProfitMargin = Math.round(baseProfitMargin - 2 + (Math.random() * 4));
    
    // Generate pricing recommendations
    const pricingStrategy = businessRules.generatePricingStrategy(
      price,
      pricingRecommendation,
      sanitizedPriceElasticity,
      formData.productCategory
    );
    
    // Generate growth opportunities based on platforms
    const growthOpportunities = businessRules.generateGrowthOpportunities(
      formData.platformsUsed,
      formData.targetMarket,
      formData.primaryGoal,
      formData.productCategory
    );
    
    // Generate risks based on market and business conditions
    const risks = businessRules.generateRisks(
      formData.productCategory,
      sanitizedGrowthRate,
      sanitizedMarketSharePotential
    );
    
    // Generate action plan based on all insights
    const actionPlan = businessRules.generateActionPlan(
      pricingRecommendation,
      formData.primaryGoal,
      growthOpportunities.platforms,
      risks
    );
    
    // Set primary challenge from highest severity risk
    const highestRisk = risks.sort((a, b) => {
      const severityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return severityValues[b.severity] - severityValues[a.severity];
    })[0];
    
    // --- FIX 7: Create properly formatted output with sanitized values ---
    return {
      summaryMetrics: {
        growthPotential: `${sixMonthGrowthPercent}% projected revenue increase over 6 months`,
        primaryChallenge: highestRisk.description,
        topRecommendation: sanitizedPriceChange > 0 
          ? `${Math.round(sanitizedPriceChange * 100)}% price increase & product bundles` 
          : 'Maintain current pricing & focus on marketing',
        marketPosition: `${Math.round(currentMarketShare)}% market share with ${sanitizedMarketSharePotential > 0.1 ? 'strong' : 'moderate'} growth opportunity`
      },
      marketTrends: {
        overall: `The ${formData.productCategory} market in Sri Lanka is showing ${(sanitizedGrowthRate * 100).toFixed(1)}% growth YoY with ${
          sanitizedMarketSharePotential > 0.1 ? 'significant' : 'moderate'
        } opportunity for expansion`,
        seasonal: seasonalTrends,
        competitiveLandscape: `${
          competitorAnalysis.filter(c => c.name !== 'Your Business' && c.name !== 'Others').length > 3 
            ? 'High' 
            : 'Medium'
        } saturation in the ${formData.productCategory} segment, with peak demand during ${peakMonths || 'festival seasons'}`,
        competitorAnalysis: competitorAnalysis
      },
      financialProjections: {
        revenueData: revenueData,
        profitMargin: {
          current: currentProfitMargin,
          projected: projectedProfitMargin,
          industry: industryProfitMargin
        },
        breakEvenAnalysis: {
          fixedCosts: monthlyRevenueNum * 0.35,
          variableCostsPerUnit: price * 0.45,
          breakEvenUnits: Math.round((monthlyRevenueNum * 0.35) / (price * 0.55))
        }
      },
      pricingStrategy: pricingStrategy,
      growthOpportunities: growthOpportunities,
      risks: risks,
      actionPlan: actionPlan
    };
  };

  // Fallback to pure rule-based analysis if ML fails
  const generateRuleBasedAnalysis = () => {
    const price = parseFloat(formData.currentPricing);
    const monthlyRevenueNum = parseFloat(formData.monthlyRevenue);
    
    // Apply business rules without ML but with realistic values
    return businessLogicAnalysis(
      0.12,                 // 12% annual growth rate
      1.2,                  // Medium elasticity 
      0.15,                 // 15% price increase recommendation
      0.08                  // 8% market share potential
    );
  };

  // Render chart for seasonal trends with improved spacing and local context
  const renderSeasonalTrendChart = () => {
    if (!analysisResults) return null;
    
    const trends = analysisResults.marketTrends.seasonal;
    const peakMonths = trends
      .filter(month => month.value > 110)
      .map(month => month.month)
      .join(', ');
    
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm mt-4">
        <h4 className="text-lg font-medium mb-1">මෙයින් කාලීන ඉල්ලුම හඳුනා ගන්න (Seasonal Demand)</h4>
        <p className="text-sm text-gray-600 mb-4">
          ඔබේ අලෙවිය වැඩි කිරීමට හොඳම මාස: <span className="font-semibold">{peakMonths}</span>
          <br/><span className="text-xs">(Best months to focus on marketing and stock preparation)</span>
        </p>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end h-52 gap-3 min-w-[720px]">
            {trends.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full rounded-t-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${(item.value / 140) * 100}%`,
                    backgroundColor: getColorForValue(item.value)
                  }}
                >
                  {item.value}
                </div>
                <div className="text-xs mt-1 font-semibold">{item.month}</div>
                <div className="text-xs text-gray-500 mt-1 w-16 text-center overflow-hidden text-ellipsis" title={item.reason}>{item.reason}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <p className="text-xs text-blue-800">
            <span className="font-bold">TIP:</span> Plan marketing campaigns and inventory around peak seasons. Values above 100 indicate higher than average demand.
          </p>
        </div>
      </div>
    );
  };

  // Render competitor pricing chart with better alignment and explanation
  const renderCompetitorPricingChart = () => {
    if (!analysisResults) return null;
    
    const pricingData = analysisResults.pricingStrategy.competitivePricing;
    const currentPrice = pricingData.find(item => item.competitor === 'Your Current')?.price || 0;
    const recommendedPrice = pricingData.find(item => item.competitor === 'Recommended')?.price || 0;
    const percentChange = ((recommendedPrice - currentPrice) / currentPrice * 100).toFixed(1);
    
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm mt-6">
        <h4 className="text-lg font-medium mb-1">තරඟකාරී මිල විශ්ලේෂණය (Competitive Pricing)</h4>
        <p className="text-sm text-gray-600 mb-4">
          නිර්දේශිත මිල වෙනස: <span className={`font-semibold ${percentChange > 0 ? 'text-green-700' : 'text-red-700'}`}>
            {percentChange > 0 ? '+' : ''}{percentChange}%
          </span>
          <br/><span className="text-xs">(Compare your price position in the market)</span>
        </p>
        <div className="relative h-20 bg-gray-100 rounded-md my-8 flex items-center">
          {pricingData.map((item, index) => (
            <div 
              key={index} 
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${(item.price / (pricingData[4].price * 1.1)) * 100}%`,
                top: item.competitor === 'Your Current' || item.competitor === 'Recommended' ? '-20px' : '20px'
              }}
            >
              <div 
                className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center ${
                  item.competitor === 'Your Current' ? 'bg-blue-600' : 
                  item.competitor === 'Recommended' ? 'bg-green-600' : 'bg-gray-400'
                }`}
              >
                {item.competitor === 'Your Current' && <span className="text-white text-xs">C</span>}
                {item.competitor === 'Recommended' && <span className="text-white text-xs">R</span>}
              </div>
              <div className={`text-xs font-medium mt-1 whitespace-nowrap ${
                item.competitor === 'Your Current' ? 'text-blue-600' : 
                item.competitor === 'Recommended' ? 'text-green-600' : 'text-gray-600'
              }`}>
                LKR {item.price.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{item.competitor}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-center">
          <div className="flex items-center gap-1 mx-auto">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-xs">ඔබේ වත්මන් මිල (Current)</span>
          </div>
          <div className="flex items-center gap-1 mx-auto">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-xs">නිර්දේශිත මිල (Recommended)</span>
          </div>
        </div>
      </div>
    );
  };

  // Render market share pie chart with improved visual explanation
  const renderMarketShareChart = () => {
    if (!analysisResults) return null;
    
    const competitorData = analysisResults.marketTrends.competitorAnalysis;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const yourShare = competitorData.find(item => item.name === 'Your Business')?.marketShare || 0;
    
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm mt-4">
        <h4 className="text-lg font-medium mb-1">වෙළඳපොළ කොටස් විශ්ලේෂණය (Market Share)</h4>
        <p className="text-sm text-gray-600 mb-4">
          ඔබගේ වෙළඳපොළ කොටස: <span className="font-semibold">{yourShare}%</span>
          <br/><span className="text-xs">(Your position compared to competitors)</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {competitorData.map((item, index) => {
                // Calculate pie slice
                const previousTotal = competitorData
                  .slice(0, index)
                  .reduce((sum, curr) => sum + curr.marketShare, 0);
                const total = competitorData
                  .reduce((sum, curr) => sum + curr.marketShare, 0);
                const startAngle = (previousTotal / total) * 360;
                const endAngle = ((previousTotal + item.marketShare) / total) * 360;
                
                // Convert to radians for SVG arc
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = ((endAngle - 90) * Math.PI / 180);
                
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
                
                // Slightly push out the slice for highlighting
                const isYourBusiness = item.name === 'Your Business';
                const radius = isYourBusiness ? 42 : 40;
                const midAngleRad = (startRad + endRad) / 2;
                const midX = 50 + (isYourBusiness ? 5 : 0) * Math.cos(midAngleRad);
                const midY = 50 + (isYourBusiness ? 5 : 0) * Math.sin(midAngleRad);
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke={isYourBusiness ? "#000" : "#fff"}
                    strokeWidth={isYourBusiness ? "1" : "0.5"}
                    transform={isYourBusiness ? `translate(${midX - 50}, ${midY - 50})` : ''}
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            {competitorData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-sm mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className={`text-sm ${item.name === 'Your Business' ? 'font-bold' : ''}`}>
                  {item.name === 'Your Business' ? 'ඔබගේ ව්‍යාපාරය' : item.name} ({item.marketShare}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <p className="text-xs text-blue-800">
            <span className="font-bold">TIP:</span> Focus on growing your market share by targeting specific competitor 
            weaknesses or exploring underserved customer segments.
          </p>
        </div>
      </div>
    );
  };

  // Render projected revenue chart with simplified explanation
  const renderProjectedRevenueChart = () => {
    if (!analysisResults) return null;
    
    const revenueData = analysisResults.financialProjections.revenueData;
    const currentRevenue = revenueData[0].amount;
    const projectedRevenue = revenueData[revenueData.length-1].amount;
    const growthPercent = ((projectedRevenue - currentRevenue) / currentRevenue * 100).toFixed(1);
    
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm mt-4">
        <h4 className="text-lg font-medium mb-1">ආදායම් පුරෝකථනය (Revenue Forecast)</h4>
        <p className="text-sm text-gray-600 mb-4">
          මාස 6ක ආදායම් වර්ධනය: <span className="font-semibold text-green-700">+{growthPercent}%</span>
          <br/><span className="text-xs">(Projected revenue growth over next 6 months)</span>
        </p>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end h-52 gap-4 min-w-[500px]">
            {revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${(item.amount / (revenueData[revenueData.length - 1].amount * 1.1)) * 100}%`
                  }}
                >
                  LKR {(item.amount/1000).toFixed(0)}K
                </div>
                <div className="text-xs mt-1 font-semibold">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <p className="text-xs text-blue-800">
            <span className="font-bold">TIP:</span> This forecast is based on implementing our recommended 
            pricing and marketing strategies. Use this to plan your cash flow and investments.
          </p>
        </div>
      </div>
    );
  };

  // Simplified profit margin display
  const renderProfitMargins = () => {
    if (!analysisResults) return null;
    
    const { current, projected, industry } = analysisResults.financialProjections.profitMargin;
    const improvement = projected - current;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-gray-700 text-sm mb-2">ලාභ ආන්තිකය (Profit Margin)</h4>
        
        <div className="flex items-center mt-3">
          <div className="w-24 text-xs text-right pr-2">ඔබගේ වත්මන්:</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
            <div 
              className="bg-blue-600 h-3 rounded-full" 
              style={{ width: `${Math.min(100, current)}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium w-12">
            {current}%
          </span>
        </div>
        
        <div className="flex items-center mt-3">
          <div className="w-24 text-xs text-right pr-2">පුරෝකථනය:</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
            <div 
              className="bg-green-600 h-3 rounded-full" 
              style={{ width: `${Math.min(100, projected)}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium w-12">
            {projected}%
          </span>
        </div>
        
        <div className="flex items-center mt-3">
          <div className="w-24 text-xs text-right pr-2">කර්මාන්ත සාමාන්ය:</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
            <div 
              className="bg-gray-500 h-3 rounded-full" 
              style={{ width: `${Math.min(100, industry)}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium w-12">
            {industry}%
          </span>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            {improvement > 0 ? 
              `Our recommendations could improve your profit margin by +${improvement}%` : 
              'Focus on maintaining current margin while growing revenue'}
          </p>
        </div>
      </div>
    );
  };

  // Helper function to get color based on value
  const getColorForValue = (value) => {
    if (value > 120) return '#4338ca'; // Indigo-700
    if (value > 100) return '#3b82f6'; // Blue-500
    if (value > 80) return '#60a5fa';  // Blue-400
    if (value > 60) return '#93c5fd';  // Blue-300
    return '#bfdbfe';                   // Blue-200
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <br />
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
        
        <h1 className="text-2xl font-bold text-center mb-6">AI Business Advisor Tool</h1>
        <p className="text-center mb-8 text-gray-600">Empower your business with data-driven insights and actionable strategies</p>
        
        {modelLoading && (
          <div className="text-center p-4 mb-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">Loading AI business model...</p>
          </div>
        )}
        
        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'input' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('input')}
          >
            Business Input
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('results')}
            disabled={!analysisResults}
          >
            Analysis Results
          </button>
        </div>
        
        {activeTab === 'input' && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Your Business Name"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
                )}
              </div>
              
              {/* Product Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.productCategory ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a category</option>
                  {productCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.productCategory && (
                  <p className="mt-1 text-sm text-red-500">{errors.productCategory}</p>
                )}
              </div>
              
              {/* Current Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Product Price (LKR)
                </label>
                <input
                  type="text"
                  name="currentPricing"
                  value={formData.currentPricing}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.currentPricing ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="5000"
                />
                {errors.currentPricing && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentPricing}</p>
                )}
              </div>
              
              {/* Monthly Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Revenue (LKR)
                </label>
                <input
                  type="text"
                  name="monthlyRevenue"
                  value={formData.monthlyRevenue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.monthlyRevenue ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="100000"
                />
                {errors.monthlyRevenue && (
                  <p className="mt-1 text-sm text-red-500">{errors.monthlyRevenue}</p>
                )}
              </div>
              
              {/* Primary Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Business Goal
                </label>
                <select
                  name="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.primaryGoal ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select your primary goal</option>
                  {businessGoals.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
                {errors.primaryGoal && (
                  <p className="mt-1 text-sm text-red-500">{errors.primaryGoal}</p>
                )}
              </div>
              
              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Market Description
                </label>
                <input
                  type="text"
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.targetMarket ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Urban Colombo, tourists, export markets"
                />
                {errors.targetMarket && (
                  <p className="mt-1 text-sm text-red-500">{errors.targetMarket}</p>
                )}
              </div>
              
              {/* Competitor URLs */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competitor URLs (Optional)
                </label>
                <textarea
                  name="competitorUrls"
                  value={formData.competitorUrls}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter competitor websites separated by commas"
                  rows={2}
                />
              </div>
              
              {/* Platforms Used */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platforms Currently Using
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availablePlatforms.map(platform => (
                    <div key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        id={platform}
                        checked={formData.platformsUsed.includes(platform)}
                        onChange={() => handlePlatformChange(platform)}
                        className="mr-2"
                      />
                      <label htmlFor={platform} className="text-sm">{platform}</label>
                    </div>
                  ))}
                </div>
                {errors.platformsUsed && (
                  <p className="mt-1 text-sm text-red-500">{errors.platformsUsed}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Generate Business Insights'}
              </button>
            </div>
          </form>
        )}
        
        {activeTab === 'results' && analysisResults && (
          <div className="space-y-8">
            {/* Summary Section */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Executive Summary</h3>
              <p className="mb-3">Based on your input for <strong>{formData.businessName}</strong> in the <strong>{formData.productCategory}</strong> category, we've identified the following key insights:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                  <div className="flex">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Growth Potential</h4>
                      <p className="text-sm text-gray-600">{analysisResults.summaryMetrics.growthPotential}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                  <div className="flex">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Primary Challenge</h4>
                      <p className="text-sm text-gray-600">{analysisResults.summaryMetrics.primaryChallenge}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                  <div className="flex">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Top Recommendation</h4>
                      <p className="text-sm text-gray-600">{analysisResults.summaryMetrics.topRecommendation}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                  <div className="flex">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Market Position</h4>
                      <p className="text-sm text-gray-600">{analysisResults.summaryMetrics.marketPosition}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market Trends Section - Updated with clearer layout */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">වෙළඳපොළ ප්‍රවණතා විශ්ලේෂණය (Market Trends)</h3>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <p className="font-medium text-gray-800">{analysisResults.marketTrends.overall}</p>
                <p className="mt-2 text-gray-700">තරඟකාරී දර්ශනය: {analysisResults.marketTrends.competitiveLandscape}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSeasonalTrendChart()}
                {renderMarketShareChart()}
              </div>
            </div>
            
            {/* Financial Projections - Redesigned for clarity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-800">මූල්‍ය පුරෝකථන (Financial Projections)</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  මාස 6
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {renderProjectedRevenueChart()}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {renderProfitMargins()}
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 text-sm mb-2">සමච්ඡේදන විශ්ලේෂණය (Break-Even)</h4>
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">ස්ථාවර පිරිවැය (Fixed Costs):</span>
                        <span className="text-sm font-medium">LKR {(analysisResults.financialProjections.breakEvenAnalysis.fixedCosts/1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">ඒකක පිරිවැය (Unit Cost):</span>
                        <span className="text-sm font-medium">LKR {analysisResults.financialProjections.breakEvenAnalysis.variableCostsPerUnit.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t">
                        <span className="text-sm font-medium text-gray-700">සමච්ඡේදන ඒකක:</span>
                        <span className="text-lg font-bold text-blue-700">{analysisResults.financialProjections.breakEvenAnalysis.breakEvenUnits} units</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 text-sm mb-2">ප්‍රධාන මූල්‍ය අන්තර්දෘෂ්ටි (Key Insights)</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-sm">මාස 3න් ධනාත්මක මුදල් ප්‍රවාහය</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-sm">අලෙවිකරණයෙන් 15% ආයෝජන ප්‍රතිලාභ</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-yellow-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-sm">තොග පිරිවැටුම් අනුපාතය නිරීක්ෂණය කරන්න</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Strategy - Simplified for clarity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">මිල උපාය මාර්ගය (Pricing Strategy)</h3>
              
              <div className="flex flex-wrap gap-4 mb-4 justify-center">
                <div className="bg-white p-4 rounded-lg shadow-sm min-w-[130px] flex-1 text-center">
                  <p className="text-sm text-gray-600">වත්මන් මිල</p>
                  <p className="text-lg font-bold text-blue-600">{analysisResults.pricingStrategy.currentAverage}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm min-w-[130px] flex-1 text-center">
                  <p className="text-sm text-gray-600">නිර්දේශිත මිල</p>
                  <p className="text-lg font-bold text-green-600">{analysisResults.pricingStrategy.recommendedPrice}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm min-w-[130px] flex-1 text-center">
                  <p className="text-sm text-gray-600">මිල ප්‍රත්‍යස්ථතාව</p>
                  <p className="text-lg font-bold">{analysisResults.pricingStrategy.priceElasticity}</p>
                </div>
              </div>
              
              {renderCompetitorPricingChart()}
              
              <div className="bg-white p-5 rounded-lg shadow-sm mt-6">
                <h4 className="text-lg font-medium mb-2">මිල නිර්දේශ (Pricing Recommendations):</h4>
                <ul className="list-disc pl-5 mt-2 space-y-3">
                  {analysisResults.pricingStrategy.bundleOpportunities.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>උපදෙස:</strong> දින 30-45 අතර කාලයක් තුළ මිල වැඩි කිරීම ක්‍රමයෙන් සිදු කරන්න. ඔබගේ නිෂ්පාදනයේ 
                    විශේෂත්වය පැහැදිලි කරමින් මිල වැඩිකිරීම සිදු කරන්න.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Plan - Simplified with clearer sections */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">ක්‍රියාකාරී සැලැස්ම (Action Plan)</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="flex items-center font-medium text-blue-900 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    ඉක්මන් ක්‍රියාමාර්ග (දින 30 ඇතුළත)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.immediate.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="flex items-center font-medium text-blue-900 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    කෙටි කාලීන ක්‍රියාමාර්ග (1-3 මාස)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.shortTerm.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="flex items-center font-medium text-blue-900 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    දිගු කාලීන උපාය මාර්ග (3-6 මාස)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.longTerm.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBusinessAdvisorTool;