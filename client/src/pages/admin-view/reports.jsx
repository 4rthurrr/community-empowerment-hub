import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { ArrowDownToLine, FileText, BarChart4, Calendar, DollarSign, FileDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

function AdminReports() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);
  const [reportType, setReportType] = useState("sales");
  const [timeFrame, setTimeFrame] = useState("all");
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingProducts: []
  });

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderList && productList) {
      generateReport(reportType, timeFrame);
    }
  }, [reportType, timeFrame, orderList, productList]);

  const generateReport = (type, period) => {
    if (!orderList || !productList) return;

    let filteredOrders = [...orderList];
    
    // Filter orders by time period
    if (period !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch(period) {
        case "last7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "last90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }
      
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.orderDate) >= cutoffDate
      );
    }

    if (type === "sales") {
      // Prepare sales report data
      const salesData = filteredOrders.map(order => ({
        id: order._id,
        date: format(new Date(order.orderDate), 'yyyy-MM-dd'),
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.cartItems.reduce((sum, item) => sum + item.quantity, 0),
        amount: order.totalAmount
      }));
      
      setReportData(salesData);
      
      // Calculate summary data
      const totalSales = salesData.reduce((sum, order) => sum + order.amount, 0);
      const totalOrders = salesData.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      
      // Calculate top-selling products
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
      
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      
      setSummaryData({
        totalSales,
        totalOrders,
        averageOrderValue,
        topSellingProducts: topProducts
      });
      
    } else if (type === "products") {
      // Prepare product inventory & performance report
      const productMap = {};
      
      // Initialize product map with inventory data
      productList.forEach(product => {
        productMap[product._id] = {
          id: product._id,
          title: product.title,
          category: product.category,
          price: product.price,
          inStock: product.totalStock,
          quantitySold: 0,
          revenue: 0
        };
      });
      
      // Add sales data to products
      filteredOrders.forEach(order => {
        if (order.orderStatus === "delivered" || order.orderStatus === "confirmed") {
          order.cartItems.forEach(item => {
            if (productMap[item.productId]) {
              productMap[item.productId].quantitySold += item.quantity;
              productMap[item.productId].revenue += item.quantity * parseFloat(item.price);
            }
          });
        }
      });
      
      setReportData(Object.values(productMap));
      
      // Calculate summary metrics
      const totalInventory = productList.reduce((sum, product) => sum + product.totalStock, 0);
      const totalSoldItems = Object.values(productMap).reduce((sum, product) => sum + product.quantitySold, 0);
      const totalRevenue = Object.values(productMap).reduce((sum, product) => sum + product.revenue, 0);
      
      // Find top performing products by revenue
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
        
      setSummaryData({
        totalInventory,
        totalSoldItems,
        totalRevenue,
        topSellingProducts: topProducts
      });
    }
  };

  const exportToCSV = () => {
    if (reportData.length === 0) return;
    
    // Create CSV content based on report type
    let csvContent = '';
    let filename = '';
    
    if (reportType === 'sales') {
      // Headers for sales report
      csvContent = 'Order ID,Date,Status,Payment Status,Items,Amount\n';
      
      // Data rows
      reportData.forEach(order => {
        csvContent += `${order.id},${order.date},${order.status},${order.paymentStatus},${order.items},${order.amount}\n`;
      });
      
      filename = `sales_report_${timeFrame}_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      // Headers for product report
      csvContent = 'Product ID,Title,Category,Price,In Stock,Quantity Sold,Revenue\n';
      
      // Data rows
      reportData.forEach(product => {
        csvContent += `${product.id},${product.title},${product.category},${product.price},${product.inStock},${product.quantitySold},${product.revenue}\n`;
      });
      
      filename = `product_report_${timeFrame}_${new Date().toISOString().slice(0, 10)}.csv`;
    }
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    if (reportData.length === 0) return;
    
    try {
      // Dynamically import both jsPDF and the autotable plugin
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      const title = reportType === 'sales' ? 'Sales Report' : 'Product Report';
      const period = timeFrame === 'all' ? 'All Time' : 
                     timeFrame === 'last7days' ? 'Last 7 Days' : 
                     timeFrame === 'last30days' ? 'Last 30 Days' : 'Last 90 Days';
      
      doc.setFontSize(18);
      doc.text(`Community Empowerment Hub`, pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`${title} - ${period}`, pageWidth / 2, 25, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd')}`, pageWidth / 2, 35, { align: 'center' });
      
      // Add summary section
      doc.setFontSize(12);
      doc.text('Summary', 14, 45);
      
      if (reportType === 'sales') {
        doc.autoTable({
          startY: 50,
          head: [['Total Orders', 'Total Sales', 'Average Order Value']],
          body: [[
            summaryData.totalOrders,
            `LKR ${summaryData.totalSales.toFixed(2)}`,
            `LKR ${summaryData.averageOrderValue.toFixed(2)}`
          ]],
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
      } else {
        doc.autoTable({
          startY: 50,
          head: [['Total Products', 'Total Revenue', 'Items Sold', 'Total Inventory']],
          body: [[
            productList?.length || 0,
            `LKR ${summaryData.totalRevenue?.toFixed(2) || '0.00'}`,
            summaryData.totalSoldItems || 0,
            summaryData.totalInventory || 0
          ]],
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
      }
      
      // Add main report data
      doc.setFontSize(12);
      doc.text('Detailed Report', 14, doc.lastAutoTable.finalY + 10);
      
      if (reportType === 'sales') {
        // Sales report table
        const salesColumns = ['Order ID', 'Date', 'Status', 'Payment', 'Items', 'Amount'];
        const salesRows = reportData.map(order => [
          order.id.substring(0, 8),
          order.date,
          order.status,
          order.paymentStatus,
          order.items,
          `LKR ${order.amount.toFixed(2)}`
        ]);
        
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          head: [salesColumns],
          body: salesRows,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
      } else {
        // Product report table
        const productColumns = ['Product', 'Category', 'Price', 'In Stock', 'Sold', 'Revenue'];
        const productRows = reportData.map(product => [
          product.title,
          product.category,
          `LKR ${product.price.toFixed(2)}`,
          product.inStock,
          product.quantitySold,
          `LKR ${product.revenue.toFixed(2)}`
        ]);
        
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          head: [productColumns],
          body: productRows,
          theme: 'grid',
          headStyles: { fillColor: [66, 139, 202] }
        });
      }
      
      // Add top selling products
      doc.setFontSize(12);
      doc.text('Top Selling Products', 14, doc.lastAutoTable.finalY + 10);
      
      const topProductsColumns = ['Product', 'Quantity Sold', 'Revenue'];
      const topProductsRows = summaryData.topSellingProducts.map(product => [
        product.title,
        product.quantity,
        `LKR ${product.revenue.toFixed(2)}`
      ]);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [topProductsColumns],
        body: topProductsRows.length > 0 ? topProductsRows : [['No sales data available', '', '']],
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10);
        doc.text('Community Empowerment Hub', 20, doc.internal.pageSize.height - 10);
      }
      
      // Save the PDF
      const filename = `${reportType}_report_${timeFrame}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      
      {/* Report Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label htmlFor="report-type" className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label htmlFor="time-frame" className="text-sm font-medium">Time Period</label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger id="time-frame" className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto md:ml-auto md:self-end">
              <div className="flex gap-2">
                <Button onClick={exportToCSV} className="flex items-center gap-2">
                  <ArrowDownToLine size={16} />
                  <span>Export CSV</span>
                </Button>
                
                <Button onClick={exportToPDF} variant="secondary" className="flex items-center gap-2">
                  <FileDown size={16} />
                  <span>Export PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportType === 'sales' ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {summaryData.totalSales.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
                <BarChart4 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {summaryData.averageOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Date Range</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-md font-bold capitalize">
                  {timeFrame === 'all' ? 'All Time' : 
                   timeFrame === 'last7days' ? 'Last 7 Days' : 
                   timeFrame === 'last30days' ? 'Last 30 Days' : 'Last 90 Days'}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productList?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {summaryData.totalRevenue?.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
                <BarChart4 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalSoldItems || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalInventory || 0}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>{reportType === 'sales' ? 'Sales Report' : 'Product Report'}</CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === 'sales' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="text-right">LKR {order.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No data available for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>LKR {product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.inStock <= 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of stock
                          </span>
                        ) : product.inStock < 10 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Low stock ({product.inStock})
                          </span>
                        ) : (
                          <span>{product.inStock}</span>
                        )}
                      </TableCell>
                      <TableCell>{product.quantitySold}</TableCell>
                      <TableCell className="text-right">LKR {product.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.topSellingProducts.length > 0 ? (
                summaryData.topSellingProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="text-right">LKR {product.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No sales data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminReports;
