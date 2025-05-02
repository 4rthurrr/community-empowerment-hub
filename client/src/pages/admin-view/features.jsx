import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays } from "date-fns";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  HeartHandshake,
  Calendar
} from "lucide-react";

function AdminFeatures() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);
  
  const [timeRange, setTimeRange] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState({
    salesSummary: {
      totalSales: 0,
      previousPeriodSales: 0,
      growth: 0,
      averageOrderValue: 0
    },
    orderStats: {
      totalOrders: 0,
      previousPeriodOrders: 0,
      growth: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      rejectedOrders: 0
    },
    productStats: {
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      topSellingProducts: []
    },
    userStats: {
      totalCustomers: 0,
      newCustomers: 0,
      returnCustomers: 0
    },
    donationStats: {
      totalDonations: 0,
      totalDonationAmount: 0,
      recentDonations: []
    }
  });
  
  const [salesByDate, setSalesByDate] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch products and orders with error handling
        await Promise.allSettled([
          dispatch(fetchAllProducts()),
          dispatch(getAllOrdersForAdmin())
        ]);
        
        // Use local data if available, even if API calls for users/donations fail
        const productData = productList || [];
        const orderData = orderList || [];
        
        let userData = [];
        let donationData = [];
        
        try {
          // Get users data with timeout to prevent hanging
          const usersResponse = await axios.get('http://localhost:5000/api/admin/users/get', {
            timeout: 5000 // 5 second timeout
          });
          userData = usersResponse.data?.data || [];
        } catch (userError) {
          console.warn("Failed to fetch users:", userError.message);
        }
        
        try {
          // Get donations data with timeout to prevent hanging
          const donationsResponse = await axios.get('http://localhost:5000/api/admin/donations/get', {
            timeout: 5000 // 5 second timeout
          });
          donationData = donationsResponse.data?.data || [];
        } catch (donationError) {
          console.warn("Failed to fetch donations:", donationError.message);
        }
        
        // Process data with what we have, even if some requests failed
        processAnalyticsData(productData, orderData, userData, donationData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        // Process with empty data as fallback
        processAnalyticsData([], [], [], []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, timeRange]);

  const getDateRangeFilter = () => {
    const currentDate = new Date();
    
    switch(timeRange) {
      case "7days":
        return subDays(currentDate, 7);
      case "30days":
        return subDays(currentDate, 30);
      case "90days":
        return subDays(currentDate, 90);
      case "year":
        return subDays(currentDate, 365);
      default:
        return subDays(currentDate, 30);
    }
  };

  const processAnalyticsData = (products, orders, users, donations) => {
    // Don't proceed with empty data, initialize with zeros instead
    if (!products?.length && !orders?.length) {
      setAnalyticsData({
        salesSummary: {
          totalSales: 0,
          previousPeriodSales: 0,
          growth: 0,
          averageOrderValue: 0
        },
        orderStats: {
          totalOrders: 0,
          previousPeriodOrders: 0,
          growth: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          deliveredOrders: 0,
          rejectedOrders: 0
        },
        productStats: {
          totalProducts: products?.length || 0,
          lowStockProducts: 0,
          outOfStockProducts: 0,
          topSellingProducts: []
        },
        userStats: {
          totalCustomers: users?.length || 0,
          newCustomers: 0,
          returnCustomers: 0
        },
        donationStats: {
          totalDonations: 0,
          totalDonationAmount: 0,
          recentDonations: []
        }
      });
      
      // Initialize empty charts
      setSalesByDate([]);
      setSalesByCategory([]);
      setOrdersByStatus([
        { name: 'Pending', value: 0 },
        { name: 'Confirmed', value: 0 },
        { name: 'Delivered', value: 0 },
        { name: 'Rejected', value: 0 }
      ]);
      
      return;
    }
    
    const dateRangeFilter = getDateRangeFilter();
    const previousDateRangeFilter = subDays(dateRangeFilter, dateRangeFilter.getTime() - new Date().getTime());
    
    // Filter orders by date range
    const filteredOrders = orders.filter(order => new Date(order.orderDate) >= dateRangeFilter);
    const previousPeriodOrders = orders.filter(order => 
      new Date(order.orderDate) >= previousDateRangeFilter && 
      new Date(order.orderDate) < dateRangeFilter
    );

    // Calculate sales metrics
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const previousPeriodSales = previousPeriodOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const salesGrowth = previousPeriodSales === 0 ? 100 : ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;
    
    const totalOrders = filteredOrders.length;
    const previousTotalOrders = previousPeriodOrders.length;
    const ordersGrowth = previousTotalOrders === 0 ? 100 : ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100;
    
    const pendingOrders = filteredOrders.filter(order => order.orderStatus === "pending").length;
    const confirmedOrders = filteredOrders.filter(order => order.orderStatus === "confirmed").length;
    const deliveredOrders = filteredOrders.filter(order => order.orderStatus === "delivered").length;
    const rejectedOrders = filteredOrders.filter(order => order.orderStatus === "rejected").length;
    
    const averageOrderValue = totalOrders === 0 ? 0 : totalSales / totalOrders;
    
    // Calculate product metrics
    const lowStockProducts = products.filter(product => product.totalStock > 0 && product.totalStock < 10).length;
    const outOfStockProducts = products.filter(product => product.totalStock <= 0).length;
    
    // Generate top selling products
    const productSales = {};
    filteredOrders.forEach(order => {
      order.cartItems.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.quantity * parseFloat(item.price);
        } else {
          productSales[item.productId] = {
            productId: item.productId,
            title: item.title,
            quantity: item.quantity,
            revenue: item.quantity * parseFloat(item.price)
          };
        }
      });
    });
    
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    // User statistics
    const totalCustomers = users ? users.length : 0;
    const newCustomers = users ? users.filter(user => 
      new Date(user.createdAt) >= dateRangeFilter
    ).length : 0;
    const returnCustomers = totalCustomers - newCustomers;
    
    // Donation statistics
    const filteredDonations = donations.filter(donation => 
      new Date(donation.createdAt) >= dateRangeFilter && donation.status === "completed"
    );
    const totalDonations = filteredDonations.length;
    const totalDonationAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const recentDonations = filteredDonations.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 5);
    
    // Update analytics data
    setAnalyticsData({
      salesSummary: {
        totalSales,
        previousPeriodSales,
        growth: salesGrowth,
        averageOrderValue
      },
      orderStats: {
        totalOrders,
        previousPeriodOrders: previousTotalOrders,
        growth: ordersGrowth,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        rejectedOrders
      },
      productStats: {
        totalProducts: products.length,
        lowStockProducts,
        outOfStockProducts,
        topSellingProducts
      },
      userStats: {
        totalCustomers,
        newCustomers,
        returnCustomers
      },
      donationStats: {
        totalDonations,
        totalDonationAmount,
        recentDonations
      }
    });
    
    // Prepare chart data
    prepareSalesByDateChart(filteredOrders);
    prepareSalesByCategoryChart(filteredOrders);
    prepareOrdersByStatusChart(filteredOrders);
  };
  
  const prepareSalesByDateChart = (orders) => {
    // Group sales by date
    const salesMap = {};
    
    orders.forEach(order => {
      const date = format(new Date(order.orderDate), 'MMM dd');
      if (salesMap[date]) {
        salesMap[date] += order.totalAmount;
      } else {
        salesMap[date] = order.totalAmount;
      }
    });
    
    // Convert to array format for recharts
    const salesData = Object.keys(salesMap).map(date => ({
      date,
      sales: salesMap[date]
    }));
    
    // Sort by date
    salesData.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    setSalesByDate(salesData);
  };
  
  const prepareSalesByCategoryChart = (orders) => {
    // Group sales by product category
    const categoryMap = {};
    
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        const category = item.category || 'Uncategorized';
        const amount = item.quantity * parseFloat(item.price);
        
        if (categoryMap[category]) {
          categoryMap[category] += amount;
        } else {
          categoryMap[category] = amount;
        }
      });
    });
    
    // Convert to array format for recharts
    const categoryData = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));
    
    // Sort by value (descending)
    categoryData.sort((a, b) => b.value - a.value);
    
    setSalesByCategory(categoryData);
  };
  
  const prepareOrdersByStatusChart = (orders) => {
    // Count orders by status
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      delivered: 0,
      rejected: 0
    };
    
    orders.forEach(order => {
      if (statusCounts.hasOwnProperty(order.orderStatus)) {
        statusCounts[order.orderStatus]++;
      }
    });
    
    // Convert to array format for recharts
    const statusData = [
      { name: 'Pending', value: statusCounts.pending },
      { name: 'Confirmed', value: statusCounts.confirmed },
      { name: 'Delivered', value: statusCounts.delivered },
      { name: 'Rejected', value: statusCounts.rejected }
    ];
    
    setOrdersByStatus(statusData);
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format currency
  const formatCurrency = (value) => {
    return `LKR ${value.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium text-gray-500">Loading analytics data...</div>
        </div>
      ) : analyticsData.salesSummary.totalSales === 0 && 
           analyticsData.orderStats.totalOrders === 0 && 
           analyticsData.productStats.totalProducts === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-amber-800 mb-2">Unable to load complete analytics data</h3>
          <p className="text-amber-700">
            There was an issue connecting to the server or no data is available.
            You can try refreshing the page or check back later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab - Key performance indicators */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Sales Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.salesSummary.totalSales)}</div>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${analyticsData.salesSummary.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.salesSummary.growth >= 0 ? (
                        <ArrowUp className="h-3 w-3 inline mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 inline mr-1" />
                      )}
                      {Math.abs(analyticsData.salesSummary.growth).toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Orders Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.orderStats.totalOrders}</div>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${analyticsData.orderStats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.orderStats.growth >= 0 ? (
                        <ArrowUp className="h-3 w-3 inline mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 inline mr-1" />
                      )}
                      {Math.abs(analyticsData.orderStats.growth).toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Average Order Value Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.salesSummary.averageOrderValue)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Per order average</div>
                </CardContent>
              </Card>
              
              {/* Total Donations Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.donationStats.totalDonationAmount)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analyticsData.donationStats.totalDonations} total donations
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Second row of KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Products Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.productStats.totalProducts}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analyticsData.productStats.outOfStockProducts} out of stock
                  </div>
                </CardContent>
              </Card>
              
              {/* Customers Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.userStats.totalCustomers}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analyticsData.userStats.newCustomers} new in this period
                  </div>
                </CardContent>
              </Card>
              
              {/* Pending Orders Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.orderStats.pendingOrders}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Require attention
                  </div>
                </CardContent>
              </Card>
              
              {/* Time Period Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Time Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold capitalize">
                    {timeRange === '7days' ? 'Last 7 Days' : 
                     timeRange === '30days' ? 'Last 30 Days' : 
                     timeRange === '90days' ? 'Last 90 Days' : 'Last Year'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From {format(getDateRangeFilter(), 'MMM dd, yyyy')}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sales Trend Chart */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Daily sales over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesByDate}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sales by Category Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Product category distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {salesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Orders by Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders by Status</CardTitle>
                  <CardDescription>Distribution of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ordersByStatus}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Orders">
                          {ordersByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Sales Tab - Detailed sales analysis */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Sales Summary</CardTitle>
                  <CardDescription>Detailed sales metrics for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Sales</span>
                      <span className="text-2xl font-bold">{formatCurrency(analyticsData.salesSummary.totalSales)}</span>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium ${analyticsData.salesSummary.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {analyticsData.salesSummary.growth >= 0 ? (
                            <ArrowUp className="h-3 w-3 inline mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 inline mr-1" />
                          )}
                          {Math.abs(analyticsData.salesSummary.growth).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Average Order Value</span>
                      <span className="text-2xl font-bold">{formatCurrency(analyticsData.salesSummary.averageOrderValue)}</span>
                      <span className="text-xs text-muted-foreground mt-1">Per order average</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Previous Period</span>
                      <span className="text-2xl font-bold">{formatCurrency(analyticsData.salesSummary.previousPeriodSales)}</span>
                      <span className="text-xs text-muted-foreground mt-1">For comparison</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily sales over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesByDate}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesByCategory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="value" name="Sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab - Order statistics */}
          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold">{analyticsData.orderStats.totalOrders}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="text-2xl font-bold">{analyticsData.orderStats.pendingOrders}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <div className="text-2xl font-bold">{analyticsData.orderStats.confirmedOrders}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-2xl font-bold">{analyticsData.orderStats.deliveredOrders}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Orders by Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
                <CardDescription>Distribution of order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Order Growth</CardTitle>
                <CardDescription>Comparison with previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">
                      {analyticsData.orderStats.growth >= 0 ? '+' : ''}{analyticsData.orderStats.growth.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">
                      {analyticsData.orderStats.totalOrders} orders this period vs {analyticsData.orderStats.previousPeriodOrders} previous period
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab - Product statistics */}
          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold">{analyticsData.productStats.totalProducts}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="text-2xl font-bold">{analyticsData.productStats.lowStockProducts}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="text-2xl font-bold">{analyticsData.productStats.outOfStockProducts}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with highest sales in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.productStats.topSellingProducts.length > 0 ? (
                    analyticsData.productStats.topSellingProducts.map((product, index) => (
                      <div key={product.productId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-lg font-bold mr-3">{index + 1}</div>
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="text-sm text-muted-foreground">{product.quantity} sold</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(product.revenue)}</div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No sales data available for this period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Donations Tab - Donation statistics */}
          <TabsContent value="donations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <HeartHandshake className="h-5 w-5 text-pink-600 mr-2" />
                  <div className="text-2xl font-bold">{analyticsData.donationStats.totalDonations}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.donationStats.totalDonationAmount)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Donation</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      analyticsData.donationStats.totalDonations > 0 
                        ? analyticsData.donationStats.totalDonationAmount / analyticsData.donationStats.totalDonations 
                        : 0
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Most recent donations in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.donationStats.recentDonations.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.donationStats.recentDonations.map((donation, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                        <div>
                          <div className="font-medium">
                            {donation.buyerEmail || 'Anonymous'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                          </div>
                          {donation.message && (
                            <div className="text-sm italic mt-1 max-w-md">
                              "{donation.message}"
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(donation.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No donations in this period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default AdminFeatures;
