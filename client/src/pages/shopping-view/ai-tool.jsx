import React, { useState } from 'react';

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

  // Available platforms for selection
  const availablePlatforms = [
    'Etsy', 'Amazon', 'eBay', 'Instagram', 
    'Facebook', 'TikTok', 'Own Website', 'Local Markets'
  ];

  // Primary business goals options
  const businessGoals = [
    'Increase Revenue', 'Expand to New Markets', 
    'Optimize Pricing', 'Reduce Costs',
    'Build Brand Awareness'
  ];

  // Product categories
  const productCategories = [
    'Handmade Crafts', 'Digital Products', 'Food & Beverages',
    'Fashion & Accessories', 'Home Decor', 'Beauty & Personal Care',
    'Electronics', 'Services', 'Other'
  ];

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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setAnalysisResults(generateMockResults());
        setIsLoading(false);
        setActiveTab('results');
      }, 2000);
    }
  };

  // Generate mock analysis results
  const generateMockResults = () => {
    const pricingRecommendation = parseFloat(formData.currentPricing) * 1.15;
    const monthlyRevenueNum = parseFloat(formData.monthlyRevenue);
    
    return {
      marketTrends: {
        overall: `The ${formData.productCategory} market is showing 12% growth YoY with increasing demand for sustainable options`,
        seasonal: [
          { month: 'Jan', trend: 'Low', value: 60, reason: 'Post-holiday decline' },
          { month: 'Feb', trend: 'Low', value: 65, reason: 'Seasonal lull' },
          { month: 'Mar', trend: 'Medium', value: 75, reason: 'Spring shopping' },
          { month: 'Apr', trend: 'Medium', value: 80, reason: 'Tax refunds' },
          { month: 'May', trend: 'Medium', value: 85, reason: 'Mother\'s Day' },
          { month: 'Jun', trend: 'Medium', value: 90, reason: 'Summer season' },
          { month: 'Jul', trend: 'Medium', value: 95, reason: 'Mid-year sales' },
          { month: 'Aug', trend: 'High', value: 110, reason: 'Back-to-school' },
          { month: 'Sep', trend: 'Medium', value: 90, reason: 'Fall shopping' },
          { month: 'Oct', trend: 'High', value: 105, reason: 'Halloween' },
          { month: 'Nov', trend: 'High', value: 120, reason: 'Holiday shopping' },
          { month: 'Dec', trend: 'Very High', value: 140, reason: 'Christmas sales' }
        ],
        competitiveLandscape: `Medium saturation in ${formData.productCategory}`,
        competitorAnalysis: [
          { name: 'Competitor A', marketShare: 28, pricePoint: 'High', quality: 'Premium' },
          { name: 'Competitor B', marketShare: 15, pricePoint: 'Medium', quality: 'Standard' },
          { name: 'Your Business', marketShare: 8, pricePoint: 'Medium', quality: 'High' },
          { name: 'Competitor C', marketShare: 22, pricePoint: 'Low', quality: 'Economy' },
          { name: 'Others', marketShare: 27, pricePoint: 'Various', quality: 'Mixed' }
        ]
      },
      financialProjections: {
        revenueData: [
          { month: 'Current', amount: monthlyRevenueNum },
          { month: 'Month 1', amount: monthlyRevenueNum * 1.05 },
          { month: 'Month 2', amount: monthlyRevenueNum * 1.08 },
          { month: 'Month 3', amount: monthlyRevenueNum * 1.12 },
          { month: 'Month 4', amount: monthlyRevenueNum * 1.15 },
          { month: 'Month 5', amount: monthlyRevenueNum * 1.19 },
          { month: 'Month 6', amount: monthlyRevenueNum * 1.24 }
        ],
        profitMargin: {
          current: 22,
          projected: 26,
          industry: 24
        },
        breakEvenAnalysis: {
          fixedCosts: monthlyRevenueNum * 0.35,
          variableCostsPerUnit: parseFloat(formData.currentPricing) * 0.45,
          breakEvenUnits: Math.round((monthlyRevenueNum * 0.35) / (parseFloat(formData.currentPricing) * 0.55))
        }
      },
      pricingStrategy: {
        currentAverage: `$${formData.currentPricing}`,
        recommendedPrice: `$${pricingRecommendation.toFixed(2)}`,
        priceElasticity: 'Medium',
        competitivePricing: [
          { competitor: 'Market Low', price: parseFloat(formData.currentPricing) * 0.8 },
          { competitor: 'Market Average', price: parseFloat(formData.currentPricing) * 1.05 },
          { competitor: 'Your Current', price: parseFloat(formData.currentPricing) },
          { competitor: 'Recommended', price: pricingRecommendation },
          { competitor: 'Market High', price: parseFloat(formData.currentPricing) * 1.4 }
        ],
        bundleOpportunities: [
          'Bundle with complementary products for 22% higher AOV',
          'Create holiday gift sets for November-December',
          'Introduce tiered pricing with premium options'
        ]
      },
      growthOpportunities: {
        platforms: formData.platformsUsed.includes('TikTok') ? 
          ['Pinterest', 'YouTube'] : ['TikTok', 'Instagram Reels'],
        channelPerformance: [
          { channel: 'Email', conversionRate: 3.2, aov: parseFloat(formData.currentPricing) * 1.2 },
          { channel: 'Social', conversionRate: 1.8, aov: parseFloat(formData.currentPricing) * 0.9 },
          { channel: 'Organic Search', conversionRate: 2.5, aov: parseFloat(formData.currentPricing) * 1.1 },
          { channel: 'Direct', conversionRate: 4.0, aov: parseFloat(formData.currentPricing) * 1.3 }
        ],
        customerSegments: [
          'Eco-conscious millennials',
          'Corporate gift market',
          'Luxury segment seeking artisanal products'
        ],
        marketExpansion: formData.primaryGoal === 'Expand to New Markets' ?
          'International shipping to Canada and UK shows high potential' :
          'Focus on domestic market optimization first',
        keywordOpportunities: [
          { keyword: 'sustainable ' + formData.productCategory.toLowerCase(), volume: 'High', competition: 'Medium' },
          { keyword: 'handmade ' + formData.productCategory.toLowerCase(), volume: 'Medium', competition: 'Low' },
          { keyword: 'local ' + formData.productCategory.toLowerCase(), volume: 'Medium', competition: 'Low' }
        ]
      },
      risks: [
        {
          severity: 'Medium',
          description: 'Increasing competition in Q1 2025',
          mitigation: 'Differentiate through unique packaging and storytelling',
          impact: 'Potential 12% revenue decrease if not addressed'
        },
        {
          severity: 'Low',
          description: 'Potential supply chain delays in February',
          mitigation: 'Stock up on essential materials in January',
          impact: 'Could delay production by 1-2 weeks'
        },
        {
          severity: 'High',
          description: 'Rising cost of raw materials',
          mitigation: 'Lock in contracts with suppliers now or explore alternative materials',
          impact: 'Could reduce profit margins by 15% within 6 months'
        }
      ],
      actionPlan: {
        immediate: [
          'Implement recommended price increase of 15% gradually over 45 days',
          'Create 3 product bundles based on top-selling items',
          'Optimize product listings with identified keyword opportunities'
        ],
        shortTerm: [
          'Develop content strategy for 2 new recommended platforms',
          'Launch targeted campaign for corporate gift market before holiday season',
          'Secure supply chain agreements to mitigate identified risks'
        ],
        longTerm: [
          'Expand product line with 2-3 premium options at higher price points',
          'Develop international shipping capabilities for Canada and UK markets',
          'Create loyalty program to increase customer retention by 20%'
        ]
      }
    };
  };

  // Render chart for seasonal trends
  const renderSeasonalTrendChart = () => {
    if (!analysisResults) return null;
    
    const trends = analysisResults.marketTrends.seasonal;
    
    return (
      <div className="mt-4">
        <h4 className="text-lg font-medium mb-2">Seasonal Trend Forecast</h4>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end h-48 gap-2 min-w-[720px]">
            {trends.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-600 rounded-t-md flex items-center justify-center text-white text-xs font-medium"
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
      </div>
    );
  };

  // Render competitor pricing chart
  const renderCompetitorPricingChart = () => {
    if (!analysisResults) return null;
    
    const pricingData = analysisResults.pricingStrategy.competitivePricing;
    
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Competitive Price Analysis</h4>
        <div className="relative h-16 bg-gray-100 rounded-md my-8 flex items-center">
          {pricingData.map((item, index) => (
            <div 
              key={index} 
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${(item.price / (pricingData[4].price * 1.1)) * 100}%`,
                top: item.competitor === 'Your Current' || item.competitor === 'Recommended' ? '-14px' : '16px'
              }}
            >
              <div 
                className={`w-4 h-4 rounded-full mx-auto ${
                  item.competitor === 'Your Current' ? 'bg-blue-600' : 
                  item.competitor === 'Recommended' ? 'bg-green-600' : 'bg-gray-400'
                }`}
              ></div>
              <div className={`text-xs font-medium mt-1 whitespace-nowrap ${
                item.competitor === 'Your Current' ? 'text-blue-600' : 
                item.competitor === 'Recommended' ? 'text-green-600' : 'text-gray-600'
              }`}>
                ${item.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{item.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render market share pie chart
  const renderMarketShareChart = () => {
    if (!analysisResults) return null;
    
    const competitorData = analysisResults.marketTrends.competitorAnalysis;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Market Share Analysis</h4>
        <div className="flex">
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
                const endRad = (endAngle - 90) * Math.PI / 180;
                
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
          <div className="ml-4 flex flex-col justify-center">
            {competitorData.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-sm mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className={`text-sm ${item.name === 'Your Business' ? 'font-bold' : ''}`}>
                  {item.name} ({item.marketShare}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render projected revenue chart
  const renderProjectedRevenueChart = () => {
    if (!analysisResults) return null;
    
    const revenueData = analysisResults.financialProjections.revenueData;
    
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Projected Revenue (6 Months)</h4>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end h-48 gap-4 min-w-[600px]">
            {revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${(item.amount / (revenueData[revenueData.length - 1].amount * 1.1)) * 100}%`
                  }}
                >
                  ${item.amount.toFixed(0)}
                </div>
                <div className="text-xs mt-1 font-semibold">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render channel performance chart
  const renderChannelPerformanceChart = () => {
    if (!analysisResults) return null;
    
    const channelData = analysisResults.growthOpportunities.channelPerformance;
    
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Channel Performance</h4>
        <div className="space-y-3">
          {channelData.map((channel, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{channel.channel}</span>
                <span className="text-sm">AOV: ${channel.aov.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${channel.conversionRate * 10}%` }}
                ></div>
              </div>
              <div className="text-right text-xs mt-1 text-gray-500">
                {channel.conversionRate}% Conversion Rate
              </div>
            </div>
          ))}
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
                Average Product Price ($)
              </label>
              <input
                type="text"
                name="currentPricing"
                value={formData.currentPricing}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.currentPricing ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="29.99"
              />
              {errors.currentPricing && (
                <p className="mt-1 text-sm text-red-500">{errors.currentPricing}</p>
              )}
            </div>
            
            {/* Monthly Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Revenue ($)
              </label>
              <input
                type="text"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.monthlyRevenue ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="5000"
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
                placeholder="e.g., Women 25-34, health-conscious"
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
                    <p className="text-sm text-gray-600">24% projected revenue increase over 6 months</p>
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
                    <p className="text-sm text-gray-600">Rising competition and material costs</p>
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
                    <p className="text-sm text-gray-600">15% price increase & product bundles</p>
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
                    <p className="text-sm text-gray-600">8% market share with growth opportunity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Trends Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Market Trend Analysis</h3>
            <p className="font-medium">{analysisResults.marketTrends.overall}</p>
            <p className="mt-2">Competitive Landscape: {analysisResults.marketTrends.competitiveLandscape}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {renderSeasonalTrendChart()}
              {renderMarketShareChart()}
            </div>
          </div>
          
          {/* Financial Projections */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Financial Projections</h3>
            
            {renderProjectedRevenueChart()}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-600 text-sm">Profit Margin</h4>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${analysisResults.financialProjections.profitMargin.current}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {analysisResults.financialProjections.profitMargin.current}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current</p>
                
                <div className="flex items-center mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${analysisResults.financialProjections.profitMargin.projected}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {analysisResults.financialProjections.profitMargin.projected}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Projected</p>
                
                <div className="flex items-center mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-gray-500 h-2.5 rounded-full" 
                      style={{ width: `${analysisResults.financialProjections.profitMargin.industry}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {analysisResults.financialProjections.profitMargin.industry}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Industry Average</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-600 text-sm">Break-Even Analysis</h4>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Fixed Costs (Monthly)</span>
                    <span className="text-sm font-medium">${analysisResults.financialProjections.breakEvenAnalysis.fixedCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Variable Cost Per Unit</span>
                    <span className="text-sm font-medium">${analysisResults.financialProjections.breakEvenAnalysis.variableCostsPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t">
                    <span className="text-sm font-medium text-gray-700">Break-Even Units</span>
                    <span className="text-lg font-bold text-blue-700">{analysisResults.financialProjections.breakEvenAnalysis.breakEvenUnits}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-600 text-sm">Key Financial Insights</h4>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Cash flow positive by Month 3</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">ROI on marketing improving by 15%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Watch inventory turnover ratio</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Pricing Strategy */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Pricing Strategy</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg shadow-sm min-w-[120px]">
                <p className="text-sm text-gray-600">Current Average</p>
                <p className="text-lg font-bold">{analysisResults.pricingStrategy.currentAverage}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm min-w-[120px]">
                <p className="text-sm text-gray-600">Recommended Price</p>
                <p className="text-lg font-bold text-green-600">{analysisResults.pricingStrategy.recommendedPrice}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm min-w-[120px]">
                <p className="text-sm text-gray-600">Price Elasticity</p>
                <p className="text-lg font-bold">{analysisResults.pricingStrategy.priceElasticity}</p>
              </div>
            </div>
            
            {renderCompetitorPricingChart()}
            
            <div className="mt-6">
              <h4 className="font-medium mt-4">Pricing Recommendations:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                {analysisResults.pricingStrategy.bundleOpportunities.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Pro Tip:</strong> Implement the price increase gradually over 30-45 days while highlighting your quality differentiators. Consider a "loyalty price" for repeat customers.
                </p>
              </div>
            </div>
          </div>
          
          {/* Growth Opportunities */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Growth Opportunities</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium">Recommended Platforms</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm mt-2">
                  <ul className="space-y-2">
                    {analysisResults.growthOpportunities.platforms.map((platform, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                          <span className="font-medium">{platform}</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {platform === 'Pinterest' ? 'Perfect for visual products with longer consideration cycle' : 
                             platform === 'YouTube' ? 'Ideal for showcasing product details and tutorials' :
                             platform === 'TikTok' ? 'Great for reaching younger demographics with trending content' :
                             'Strong for visual storytelling and product showcases'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h4 className="font-medium mt-4">Customer Segments to Target</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm mt-2">
                  <ul className="space-y-2">
                    {analysisResults.growthOpportunities.customerSegments.map((segment, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                        </svg>
                        <div>
                          <span className="font-medium">{segment}</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {segment.includes('millennial') ? 'Values sustainability and authenticity, 38% higher average order value' : 
                             segment.includes('Corporate') ? 'Consistent B2B opportunity with higher volume orders during Q4' :
                             'Willing to pay premium prices for exceptional quality and craftsmanship'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h4 className="font-medium mt-4">Market Expansion Opportunity</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm mt-2">
                  <p className="text-gray-700">{analysisResults.growthOpportunities.marketExpansion}</p>
                </div>
              </div>
              
              <div>
                {renderChannelPerformanceChart()}
                
                <h4 className="font-medium mt-4">Keyword Opportunities</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm mt-2">
                  <div className="space-y-2">
                    {analysisResults.growthOpportunities.keywordOpportunities.map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-sm">"{keyword.keyword}"</span>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                              Vol: {keyword.volume}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Comp: {keyword.competition}
                            </span>
                          </div>
                        </div>
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Growth Insight:</strong> Focus on email marketing has the highest ROI potential with a 3.2% conversion rate. Create targeted campaigns for your top customer segments using recommended keywords.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Risk Alerts */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Risk Alerts & Mitigation</h3>
            
            {analysisResults.risks.map((risk, index) => (
              <div key={index} className="mb-4 border-l-4 pl-3 py-3 bg-white rounded-r-lg shadow-sm" style={{
                borderColor: risk.severity === 'High' ? '#ef4444' : 
                             risk.severity === 'Medium' ? '#f59e0b' : '#10b981'
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-800' : 
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.severity}
                  </span>
                  <h4 className="font-medium">{risk.description}</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Potential Impact:</strong> {risk.impact}
                </p>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Mitigation Strategy:</strong> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
          
          {/* Action Plan */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Prioritized Action Plan</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="flex items-center font-medium text-blue-900">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  Immediate Actions (Next 30 Days)
                </h4>
                <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.immediate.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div>
                <h4 className="flex items-center font-medium text-blue-900">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  Short-Term Actions (1-3 Months)
                </h4>
                <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.shortTerm.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div>
                <h4 className="flex items-center font-medium text-blue-900">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  Long-Term Strategy (3-6 Months)
                </h4>
                <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
                  <ol className="list-decimal pl-5 space-y-2">
                    {analysisResults.actionPlan.longTerm.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50"
              onClick={() => setActiveTab('input')}
            >
              Edit Business Info
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Download Full Report
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AIBusinessAdvisorTool;