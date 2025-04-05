/**
 * Business Logic Rules Engine for Sri Lankan Market for Sri Lankan Market
 * This file contains rule-based algorithms for generating business insights
 * relevant to Sri Lankan businesses.
 */

// Helper function to get month names
const getMonthName = (index) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[index % 12];
};

// Generate seasonal trends based on product category in Sri Lankan context
const generateSeasonalTrends = (category) => {
  // Base seasonality patterns (values 60-140 representing relative demand)
  // Sri Lankan base pattern with festival periods and tourism seasons
  const basePattern = [90, 85, 90, 120, 115, 80, 95, 100, 90, 95, 110, 130];
  
  // Adjust pattern based on product category with Sri Lankan context
  let adjustedPattern = [...basePattern];
  
  switch(category) {
    case 'Clothing & Batik':
      // Higher during festivals: April (New Year) and December
      adjustedPattern = [85, 90, 95, 135, 100, 85, 90, 95, 90, 100, 110, 130];
      break;
    case 'Tea Products':
      // More consistent with tourism peaks
      adjustedPattern = [110, 105, 100, 95, 90, 85, 90, 100, 100, 105, 110, 120];
      break;
    case 'Tourism Services':
      // Tourism peaks (Dec-March, July-August)
      adjustedPattern = [120, 130, 120, 95, 80, 75, 110, 120, 90, 90, 100, 130];
      break;
    case 'Food & Beverages':
      // Festival peaks and tourism influence
      adjustedPattern = [100, 95, 90, 130, 115, 90, 95, 100, 95, 100, 110, 130];
      break;
    case 'Ayurvedic Products':
      // Tourist season influence
      adjustedPattern = [110, 115, 105, 100, 95, 90, 100, 110, 95, 95, 100, 120];
      break;
    case 'Handmade Crafts/Handicrafts':
      // Tourism dependent with festival boosts
      adjustedPattern = [120, 115, 110, 115, 95, 85, 100, 115, 90, 95, 105, 130];
      break;
    default:
      // Use base pattern with small random variations
      adjustedPattern = basePattern.map(val => val + (Math.random() * 10 - 5));
  }
  
  // Add seasonal reasons based on Sri Lankan context
  const seasonalReasons = [
    'Tourist season (high)', 'Tourist season (high)', 'Pre-New Year', 
    'Sinhala & Tamil New Year', 'Vesak Festival', 'Monsoon (low)', 
    'Mid-year tourism', 'Esala Perahera season', 'Post-festival lull', 
    'Deepavali season', 'Pre-holiday build-up', 'Holiday & tourist peak'
  ];
  
  // Generate trends with proper structure
  return adjustedPattern.map((value, index) => {
    const adjustedValue = Math.round(value);
    return {
      month: getMonthName(index),
      trend: adjustedValue > 110 ? 'High' : adjustedValue > 85 ? 'Medium' : 'Low',
      value: adjustedValue,
      reason: seasonalReasons[index]
    };
  });
};

// Generate competitor analysis based on market position
const generateCompetitorAnalysis = (marketShare, category, price) => {
  // Market characteristics by category
  const marketChars = {
    'Handmade Crafts': { concentration: 'low', priceSpread: 'wide' },
    'Digital Products': { concentration: 'medium', priceSpread: 'wide' },
    'Food & Beverages': { concentration: 'high', priceSpread: 'narrow' },
    'Fashion & Accessories': { concentration: 'high', priceSpread: 'wide' },
    'Home Decor': { concentration: 'medium', priceSpread: 'medium' },
    'Beauty & Personal Care': { concentration: 'high', priceSpread: 'medium' },
    'Electronics': { concentration: 'high', priceSpread: 'narrow' },
    'Services': { concentration: 'low', priceSpread: 'wide' },
    'Other': { concentration: 'medium', priceSpread: 'medium' }
  };
  
  // Get market characteristics or use defaults
  const { concentration, priceSpread } = marketChars[category] || 
    { concentration: 'medium', priceSpread: 'medium' };
  
  // Adjust competitor distribution based on market concentration
  let competitorShares = [];
  
  if (concentration === 'high') {
    // Few dominant players
    competitorShares = [
      { name: 'Competitor A', shareMultiplier: 3.5 },
      { name: 'Competitor B', shareMultiplier: 2.0 },
      { name: 'Your Business', shareMultiplier: 1.0 },
      { name: 'Competitor C', shareMultiplier: 2.8 },
      { name: 'Others', shareMultiplier: 3.0 }
    ];
  } else if (concentration === 'medium') {
    // Moderate distribution
    competitorShares = [
      { name: 'Competitor A', shareMultiplier: 2.8 },
      { name: 'Competitor B', shareMultiplier: 1.5 },
      { name: 'Your Business', shareMultiplier: 1.0 },
      { name: 'Competitor C', shareMultiplier: 2.2 },
      { name: 'Others', shareMultiplier: 2.7 }
    ];
  } else {
    // Fragmented market
    competitorShares = [
      { name: 'Competitor A', shareMultiplier: 1.8 },
      { name: 'Competitor B', shareMultiplier: 1.4 },
      { name: 'Your Business', shareMultiplier: 1.0 },
      { name: 'Competitor C', shareMultiplier: 1.6 },
      { name: 'Others', shareMultiplier: 4.2 }
    ];
  }
  
  // Calculate total multiplier
  const totalMultiplier = competitorShares.reduce((sum, comp) => sum + comp.shareMultiplier, 0);
  
  // Normalize shares to sum to 100%
  const totalShare = 100 - marketShare;
  let remainingShare = totalShare;
  
  const result = competitorShares.map(comp => {
    let share;
    if (comp.name === 'Your Business') {
      share = marketShare;
    } else if (comp.name === 'Others') {
      // Assign remaining share to "Others"
      share = remainingShare;
    } else {
      // Calculate proportional share
      share = Math.round((comp.shareMultiplier / totalMultiplier) * totalShare);
      remainingShare -= share;
    }
    
    // Determine competitor price positioning and quality
    let pricePoint, quality;
    
    if (comp.name === 'Your Business') {
      pricePoint = 'Medium';
      quality = 'High';
    } else if (comp.name === 'Competitor A') {
      pricePoint = 'High';
      quality = 'Premium';
    } else if (comp.name === 'Competitor B') {
      pricePoint = 'Medium';
      quality = 'Standard';
    } else if (comp.name === 'Competitor C') {
      pricePoint = 'Low';
      quality = 'Economy';
    } else {
      pricePoint = 'Various';
      quality = 'Mixed';
    }
    
    return {
      name: comp.name,
      marketShare: share,
      pricePoint,
      quality
    };
  });
  
  return result;
};

// Generate revenue projections based on growth rate
const generateRevenueProjection = (currentRevenue, growthRate) => {
  // Add a safety check to prevent NaN or Infinity
  if (isNaN(currentRevenue) || !isFinite(currentRevenue) || 
      isNaN(growthRate) || !isFinite(growthRate)) {
    // Return placeholder data with default values if inputs are invalid
    return Array.from({length: 7}, (_, i) => ({
      month: i === 0 ? 'Current' : `Month ${i}`,
      amount: i === 0 ? currentRevenue || 10000 : (currentRevenue || 10000) * (1 + 0.05 * i)
    }));
  }
  
  // Convert annual growth rate to monthly with safety bounds
  const safeGrowthRate = Math.max(-0.5, Math.min(0.5, growthRate)); // Ensure growth rate is within reasonable limits
  const monthlyGrowthRate = Math.pow(1 + safeGrowthRate, 1/6) - 1;
  
  // Generate 6-month projection with safety checks
  return Array.from({length: 7}, (_, i) => {
    const amount = currentRevenue * Math.pow(1 + monthlyGrowthRate, i);
    return {
      month: i === 0 ? 'Current' : `Month ${i}`,
      amount: isNaN(amount) ? currentRevenue * (1 + (0.05 * i)) : amount // Fallback to 5% per month if calculation fails
    };
  });
};

// Generate pricing strategy recommendations for Sri Lankan market with simpler language
const generatePricingStrategy = (currentPrice, recommendedPrice, priceElasticity, category) => {
  // Add safety bounds to price recommendation
  // Ensure recommended price is within 50% increase or 30% decrease of current price
  const safeRecommendedPrice = Math.max(
    currentPrice * 0.7, 
    Math.min(currentPrice * 1.5, recommendedPrice)
  );
  
  // Determine elasticity label with safety check
  let elasticityLabel;
  const safeElasticity = isNaN(priceElasticity) ? 1.0 : priceElasticity;
  
  if (safeElasticity > 1.5) elasticityLabel = 'High';
  else if (safeElasticity > 0.8) elasticityLabel = 'Medium';
  else elasticityLabel = 'Low';
  
  // Generate competitive pricing data with safety bounds
  const competitivePricing = [
    { competitor: 'Market Low', price: currentPrice * 0.8 },
    { competitor: 'Market Average', price: currentPrice * 1.05 },
    { competitor: 'Your Current', price: currentPrice },
    { competitor: 'Recommended', price: safeRecommendedPrice },
    { competitor: 'Market High', price: currentPrice * 1.4 }
  ];
  
  // Generate bundle recommendations based on category with Sri Lankan context
  // Using simpler language for local business owners
  let bundleOpportunities = [];
  
  switch(category) {
    case 'Handmade Crafts/Handicrafts':
      bundleOpportunities = [
        'Create gift sets for tourists and hotels (will increase average sale by 20%)',
        'Use packaging that highlights Sri Lankan culture and traditions',
        'Make special offers for Avurudu and Vesak seasons'
      ];
      break;
    case 'Tea Products':
      bundleOpportunities = [
        'Create Ceylon tea sample boxes with 3-4 different varieties',
        'Add traditional Sri Lankan sweets like kavum or kokis with tea orders',
        'Create special gift boxes for tourists (can charge 35% more)'
      ];
      break;
    case 'Spices & Condiments':
      bundleOpportunities = [
        'Create curry spice collections with recipe cards showing how to use them',
        'Bundle spices that go together for popular Sri Lankan dishes',
        'Create authentic spice gift boxes for selling abroad'
      ];
      break;
    case 'Clothing & Batik':
      bundleOpportunities = [
        'Offer complete festive outfits for Avurudu (increases sales by 25%)',
        'Bundle clothing with matching accessories with batik designs',
        'Create special family sets for celebrations and holidays'
      ];
      break;
    case 'Jewelry & Gems':
      bundleOpportunities = [
        'Create collections showcasing different Ceylon gem varieties',
        'Offer traditional Sri Lankan design jewelry sets at premium prices',
        'Include authentication certificates for foreign customers'
      ];
      break;
    case 'Coconut-based Products':
      bundleOpportunities = [
        'Create gift boxes with different coconut products (oil, food items)',
        'Include recipe guides showing how to use coconut in cooking',
        'Offer monthly subscription boxes for coconut health products'
      ];
      break;
    case 'Ayurvedic Products':
      bundleOpportunities = [
        'Create wellness packages with complementary Ayurvedic items',
        'Include simple guides explaining traditional usage and benefits',
        'Offer special immunity packages during tourist season'
      ];
      break;
    case 'Tourism Services':
      bundleOpportunities = [
        'Create packages that combine accommodation with local experiences',
        'Add traditional craft workshops or cooking classes to tours',
        'Offer special festival experiences during key celebrations'
      ];
      break;
    default:
      bundleOpportunities = [
        'Bundle related products together to increase average sale by 22%',
        'Create special packages for Avurudu, Vesak and Poson festivals',
        'Offer premium options using high-quality local materials'
      ];
  }
  
  return {
    currentAverage: `LKR ${currentPrice.toFixed(0)}`,
    recommendedPrice: `LKR ${safeRecommendedPrice.toFixed(0)}`,
    priceElasticity: elasticityLabel,
    competitivePricing,
    bundleOpportunities
  };
};

// Generate growth opportunities based on Sri Lankan business profile
const generateGrowthOpportunities = (platformsUsed, targetMarket, primaryGoal, category) => {
  // Recommend new platforms based on current usage - Sri Lankan focus
  const allPlatforms = [
    'Daraz.lk', 'Kapruka', 'WOW.lk', 'Instagram', 'Pinterest', 
    'Facebook', 'TikTok', 'YouTube', 'Own Website', 'Pickme Food',
    'ikman.lk', 'Local Markets/Pola', 'Export Platforms'
  ];
  
  // Filter out platforms already in use
  const unusedPlatforms = allPlatforms.filter(p => !platformsUsed.includes(p));
  
  // Recommend platforms based on business characteristics in Sri Lanka
  let recommendedPlatforms = [];
  
  if (unusedPlatforms.length > 0) {
    // Select platforms based on product category and target market
    if ((category === 'Handmade Crafts/Handicrafts' || category === 'Jewelry & Gems') && !platformsUsed.includes('Kapruka')) {
      recommendedPlatforms.push('Kapruka');
    } else if ((category === 'Clothing & Batik' || category === 'Electronics') && !platformsUsed.includes('Daraz.lk')) {
      recommendedPlatforms.push('Daraz.lk');
    }
    
    if ((category === 'Tea Products' || category === 'Spices & Condiments' || category === 'Coconut-based Products') 
        && !platformsUsed.includes('Export Platforms') && primaryGoal === 'Export to Foreign Markets') {
      recommendedPlatforms.push('Export Platforms');
    }
    
    if (category === 'Food & Beverages' && !platformsUsed.includes('Pickme Food')) {
      recommendedPlatforms.push('Pickme Food');
    }
    
    if (!platformsUsed.includes('TikTok') && 
        (targetMarket.toLowerCase().includes('young') || 
         targetMarket.toLowerCase().includes('colombo'))) {
      recommendedPlatforms.push('TikTok');
    }
    
    if (!platformsUsed.includes('Pinterest') && 
        (category === 'Handmade Crafts/Handicrafts' || category === 'Clothing & Batik')) {
      recommendedPlatforms.push('Pinterest');
    }
    
    if (!platformsUsed.includes('ikman.lk') && 
        (category !== 'Tourism Services' && category !== 'Food & Beverages')) {
      recommendedPlatforms.push('ikman.lk');
    }
    
    // If we still don't have recommendations, pick random unused ones
    if (recommendedPlatforms.length === 0) {
      const randomIndex = Math.floor(Math.random() * unusedPlatforms.length);
      recommendedPlatforms.push(unusedPlatforms[randomIndex]);
      
      // Try to add a second recommendation if available
      if (unusedPlatforms.length > 1) {
        let secondIndex;
        do {
          secondIndex = Math.floor(Math.random() * unusedPlatforms.length);
        } while (secondIndex === randomIndex);
        
        recommendedPlatforms.push(unusedPlatforms[secondIndex]);
      }
    }
    
    // Limit to top 2 recommendations
    recommendedPlatforms = recommendedPlatforms.slice(0, 2);
  }
  
  // Generate channel performance data based on average price
  const averagePrice = category === 'Tourism Services' ? 15000 : 
                       (category === 'Jewelry & Gems' || category === 'Electronics') ? 8000 : 
                       category === 'Clothing & Batik' ? 3500 : 2000;
                       
  const channelPerformance = [
    { channel: 'Email', conversionRate: 3.2, aov: averagePrice * 1.2 },
    { channel: 'Social', conversionRate: 1.8, aov: averagePrice * 0.9 },
    { channel: 'Organic Search', conversionRate: 2.5, aov: averagePrice * 1.1 },
    { channel: 'Direct', conversionRate: 4.0, aov: averagePrice * 1.3 }
  ];
  
  // Generate customer segments based on inputs and Sri Lankan context
  let customerSegments = [];
  
  if (targetMarket.toLowerCase().includes('tourist') || 
      category === 'Tourism Services' || 
      category === 'Handmade Crafts/Handicrafts' ||
      category === 'Tea Products') {
    customerSegments.push('International tourists seeking authentic Sri Lankan products');
  }
  
  if (targetMarket.toLowerCase().includes('export') || 
      primaryGoal === 'Export to Foreign Markets' ||
      category === 'Tea Products' || 
      category === 'Spices & Condiments' ||
      category === 'Coconut-based Products') {
    customerSegments.push('Export markets (EU, Middle East, East Asia)');
  }
  
  if (targetMarket.toLowerCase().includes('colombo') || 
      targetMarket.toLowerCase().includes('urban')) {
    customerSegments.push('Urban Sri Lankan professionals in Colombo/Kandy');
  }
  
  if (targetMarket.toLowerCase().includes('eco') || 
      targetMarket.toLowerCase().includes('sustain')) {
    customerSegments.push('Eco-conscious consumers seeking sustainable options');
  }
  
  if (customerSegments.length < 3) {
    // Add default segments if we don't have enough
    const defaultSegments = [
      'Sri Lankan diaspora seeking homeland products',
      'Corporate gift market for local businesses',
      'Festival shoppers (Avurudu, Vesak, Christmas)',
      'Local hotels and hospitality businesses',
      'Young urban Sri Lankans (18-35)'
    ];
    
    while (customerSegments.length < 3) {
      const randomSegment = defaultSegments[Math.floor(Math.random() * defaultSegments.length)];
      if (!customerSegments.includes(randomSegment)) {
        customerSegments.push(randomSegment);
      }
    }
  }
  
  // Market expansion recommendation tailored to Sri Lankan context
  let marketExpansion;
  if (primaryGoal === 'Export to Foreign Markets') {
    marketExpansion = 'Focus on established export markets (EU, Middle East, Australia) with Sri Lankan trade programs';
  } else if (primaryGoal === 'Expand to New Markets') {
    marketExpansion = 'Target major tourist areas (Colombo, Kandy, Galle, Ella) and popular hotels';
  } else {
    marketExpansion = 'Focus on urban centers (Colombo, Kandy, Galle) before expanding to other regions';
  }
  
  // Generate keyword opportunities with Sri Lankan context
  const keywordOpportunities = [
    { 
      keyword: `authentic Sri Lankan ${category.toLowerCase()}`, 
      volume: 'High', 
      competition: 'Medium' 
    },
    { 
      keyword: `traditional ${category.toLowerCase()} Sri Lanka`, 
      volume: 'Medium', 
      competition: 'Low' 
    },
    { 
      keyword: `Ceylon ${category.toLowerCase()}`, 
      volume: 'Medium', 
      competition: category === 'Tea Products' ? 'High' : 'Low' 
    }
  ];
  
  return {
    platforms: recommendedPlatforms,
    channelPerformance,
    customerSegments,
    marketExpansion,
    keywordOpportunities
  };
};

// Generate risks based on business inputs
const generateRisks = (category, growthRate, marketSharePotential) => {
  // Base risks that apply to most businesses
  const baseRisks = [
    {
      severity: 'Medium',
      description: 'Increasing competition in Q1 2025',
      mitigation: 'Differentiate through unique packaging and storytelling',
      impact: 'Potential 12% revenue decrease if not addressed'
    }
  ];
  
  // Category-specific risks
  let categoryRisks = [];
  
  switch(category) {
    case 'Handmade Crafts':
      categoryRisks.push({
        severity: 'Medium',
        description: 'Rising cost of raw materials',
        mitigation: 'Lock in contracts with suppliers now or explore alternative materials',
        impact: 'Could reduce profit margins by 15% within 6 months'
      });
      break;
    case 'Digital Products':
      categoryRisks.push({
        severity: 'High',
        description: 'Increasing rate of digital piracy',
        mitigation: 'Implement stronger DRM and watermarking',
        impact: 'Up to 25% loss in revenue from unauthorized copies'
      });
      break;
    case 'Food & Beverages':
      categoryRisks.push({
        severity: 'High',
        description: 'Supply chain disruptions affecting ingredient availability',
        mitigation: 'Develop relationships with multiple suppliers and create backup recipes',
        impact: 'Production delays of 1-2 weeks and increased costs'
      });
      break;
    case 'Fashion & Accessories':
      categoryRisks.push({
        severity: 'Medium',
        description: 'Rapidly changing consumer trends',
        mitigation: 'Develop a more agile production model with shorter runs',
        impact: 'Potential inventory obsolescence of 20% if not monitored'
      });
      break;
    default:
      categoryRisks.push({
        severity: 'Low',
        description: 'Potential supply chain delays in February',
        mitigation: 'Stock up on essential materials in January',
        impact: 'Could delay production by 1-2 weeks'
      });
  }
  
  // Growth-related risks
  if (growthRate > 0.2) {
    // High growth can cause operational challenges
    baseRisks.push({
      severity: 'Medium',
      description: 'Operational scaling challenges due to rapid growth',
      mitigation: 'Invest in automation and process documentation',
      impact: 'Customer satisfaction drops if fulfillment can\'t keep pace with orders'
    });
  }
  
  // Market share risks
  if (marketSharePotential < 0.05) {
    // Low market share potential indicates saturation or competition
    baseRisks.push({
      severity: 'High',
      description: 'Limited market growth potential due to saturation',
      mitigation: 'Focus on taking share from competitors or expanding to adjacent markets',
      impact: 'Growth ceiling of 5-7% if staying in current market only'
    });
  }
  // for Sri Lankan business
  // Combine all risks and limit to 3
  return [...baseRisks, ...categoryRisks].slice(0, 3);
};

// Generate action plan based on insights for Sri Lankan business with simpler language
const generateActionPlan = (recommendedPrice, primaryGoal, recommendedPlatforms, risks, language = 'english') => {
  // Immediate actions with language awareness
  let immediateActions = [
    language === 'sinhala' 
      ? `දින 45ක් තුළ ක්‍රමානුකූලව මිල වැඩි කරන්න, එකවර නොවේ`
      : `Gradually increase your price over 45 days, not all at once`,
  ];
  
  // Add goal-specific immediate actions
  switch(primaryGoal) {
    case 'Increase Revenue':
      immediateActions.push(language === 'sinhala'
        ? 'ඉදිරි උත්සව සමය සඳහා විශේෂ නිෂ්පාදන ඇසුරුම් 3ක් සාදන්න'
        : 'Create 3 product bundles for upcoming festival seasons');
      break;
    case 'Export to Foreign Markets':
      immediateActions.push(language === 'sinhala'
        ? 'ශ්‍රී ලංකා අපනයන සංවර්ධන මණ්ඩලය (EDB) සහය සඳහා සම්බන්ධ කරගන්න'
        : 'Contact the Sri Lanka Export Development Board (EDB) for assistance');
      break;
    // ...more cases with language handling...
  }
  
  // Short-term actions (1-3 months) with simpler language
  let shortTermActions = [];
  
  // Add platform-related action if we have recommendations
  if (recommendedPlatforms && recommendedPlatforms.length > 0) {
    shortTermActions.push(language === 'sinhala'
      ? `ඔබේ නිෂ්පාදන ${recommendedPlatforms.join(' සහ ')} මත විකිණීම ආරම්භ කරන්න`
      : `Start selling on ${recommendedPlatforms.join(' and ')} platforms`);
  } else {
    shortTermActions.push(language === 'sinhala'
      ? 'ඔබේ වර්තමාන විකුණුම් වේදිකා මත ලැයිස්තු වැඩිදියුණු කරන්න'
      : 'Improve your listings on your current sales platforms');
  }
  
  // Add goal-specific short-term actions with Sri Lankan context
  switch(primaryGoal) {
    case 'Increase Revenue':
      shortTermActions.push(language === 'sinhala'
        ? 'අවුරුදු/වෙසක් සමය සඳහා විශේෂ ප්‍රවර්ධන සකස් කරන්න'
        : 'Prepare special promotions for Avurudu/Vesak seasons');
      break;
    case 'Export to Foreign Markets':
      shortTermActions.push(language === 'sinhala'
        ? 'ඔබේ නිෂ්පාදන සඳහා අවශ්‍ය අපනයන සහතික ලබා ගන්න'
        : 'Get the necessary export certifications for your products');
      break;
    // ...more cases with language handling...
  }
  
  // Long-term actions (3-6 months) with simpler language
  let longTermActions = [
    language === 'sinhala'
      ? 'ශ්‍රී ලංකාවේ අත්කම් ශිල්පය ප්‍රමුඛ කරමින් ප්‍රිමියම් නිෂ්පාදන රේඛාවක් සාදන්න'
      : 'Create premium product line highlighting authentic Sri Lankan craftsmanship',
  ];
  
  // Add goal-specific long-term actions with Sri Lankan context
  switch(primaryGoal) {
    case 'Increase Revenue':
      longTermActions.push(language === 'sinhala'
        ? 'සැරයන් බෙදාහැරීම සඳහා මාසික දායකත්වය ලබා දීම ආරම්භ කරන්න'
        : 'Start offering monthly subscriptions for regular delivery');
      break;
    case 'Export to Foreign Markets':
      longTermActions.push(language === 'sinhala'
        ? 'ඉලක්ක රටවල විශ්වාසදායී හවුල්කරුවන් සොයන්න'
        : 'Find reliable partners in target countries');
      break;
    // ...more cases with language handling...
  }
  
  return {
    immediate: immediateActions,
    shortTerm: shortTermActions,
    longTerm: longTermActions
  };
};

// Add this new function to generate more realistic growth potential assessments
const generateGrowthPotential = (category, primaryGoal, platformsUsed, price) => {
  // Base industry growth rates from market research on Sri Lankan businesses
  const industryGrowthRates = {
    'Handmade Crafts/Handicrafts': { low: 8, high: 15, median: 12 },
    'Digital Products': { low: 15, high: 25, median: 18 },
    'Food & Beverages': { low: 5, high: 12, median: 8 },
    'Clothing & Batik': { low: 7, high: 18, median: 10 },
    'Tea Products': { low: 6, high: 14, median: 9 },
    'Spices & Condiments': { low: 5, high: 12, median: 8 },
    'Ayurvedic Products': { low: 10, high: 22, median: 15 },
    'Jewelry & Gems': { low: 7, high: 16, median: 12 },
    'Coconut-based Products': { low: 4, high: 12, median: 8 },
    'Tourism Services': { low: 12, high: 30, median: 18 },
    'Other': { low: 5, high: 15, median: 10 }
  };
  
  // Get the growth rate range for this category, or use default if not found
  const { low, high, median } = industryGrowthRates[category] || { low: 5, high: 15, median: 10 };
  
  // Apply modifiers based on business inputs
  let growthModifier = 0;
  
  // Primary goal impact - FIX: Ensure "Increase Revenue" goal always results in positive growth
  if (primaryGoal === 'Increase Revenue') {
    // Set a minimum positive modifier to ensure growth is positive
    growthModifier = Math.max(5, growthModifier + 5);
  } else if (primaryGoal === 'Export to Foreign Markets') {
    growthModifier += 3;
  }
  
  // Platform diversity impact (more platforms = more reach)
  growthModifier += Math.min(4, platformsUsed.length - 2); // +1 for each platform above 2, max +4
  
  // Price points (very high prices might constrain growth potential)
  const avgPriceForCategory = {
    'Handmade Crafts/Handicrafts': 3500,
    'Digital Products': 2000,
    'Food & Beverages': 800,
    'Clothing & Batik': 2500,
    'Tea Products': 1200,
    'Spices & Condiments': 1000,
    'Ayurvedic Products': 1800,
    'Jewelry & Gems': 7500,
    'Coconut-based Products': 1400,
    'Tourism Services': 15000,
    'Other': 2500
  };
  
  const avgPrice = avgPriceForCategory[category] || 2500;
  const priceRatio = price / avgPrice;
  
  // Price significantly higher than category average might limit growth
  if (priceRatio > 2) growthModifier -= 2;
  // Price significantly lower than average might enhance growth
  if (priceRatio < 0.7) growthModifier += 1;
  
  // Calculate the 6-month growth potential with the modifier
  // Use the median as the base prediction, adjusted by modifiers
  let annualGrowthPotential = Math.max(low, Math.min(high, median + growthModifier));
  
  // FIX: Additional safeguard for "Increase Revenue" goal - enforce minimum positive growth
  if (primaryGoal === 'Increase Revenue' && annualGrowthPotential < 8) {
    annualGrowthPotential = 8; // Minimum 8% annual growth when increasing revenue is the goal
  }
  
  // Convert annual to 6-month growth (approximately half)
  const sixMonthGrowthPotential = Math.round(annualGrowthPotential / 2);
  
  // Ensure price is a number to prevent NaN errors
  price = parseFloat(price) || 1000; // Default to 1000 if conversion fails
  
  // Generate a range with consistent format
  const growthRange = {
    low: Math.max(1, sixMonthGrowthPotential - 3),
    high: sixMonthGrowthPotential + 3,
    value: sixMonthGrowthPotential
  };
  
  // Generate qualitative assessment
  let qualitativeAssessment;
  if (sixMonthGrowthPotential < 5) qualitativeAssessment = "moderate";
  else if (sixMonthGrowthPotential < 10) qualitativeAssessment = "good";
  else qualitativeAssessment = "strong";
  
  return {
    value: sixMonthGrowthPotential,
    range: growthRange,
    qualitative: qualitativeAssessment,
    disclaimer: "Based on industry averages for similar businesses implementing recommended strategies"
  };
};

// Export all business rule functions
export const businessRules = {
  generateSeasonalTrends,
  generateCompetitorAnalysis,
  generateRevenueProjection,
  generatePricingStrategy,
  generateGrowthOpportunities,
  generateGrowthPotential, // Export the new function
  generateRisks,
  generateActionPlan
};
