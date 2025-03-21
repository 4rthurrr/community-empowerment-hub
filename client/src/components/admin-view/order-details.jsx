import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Package, TruckIcon, Clock, XCircle, AlertCircle } from "lucide-react";

const initialFormData = {
  status: "",
};

// Order status icons and colors mapping
const statusConfig = {
  pending: { icon: Clock, color: "bg-amber-100 text-amber-800 border-amber-200" },
  inProcess: { icon: Package, color: "bg-blue-100 text-blue-800 border-blue-200" },
  inShipping: { icon: TruckIcon, color: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered: { icon: CheckCircle2, color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { icon: XCircle, color: "bg-red-100 text-red-800 border-red-200" },
  default: { icon: AlertCircle, color: "bg-gray-100 text-gray-800 border-gray-200" }
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    if (!status) {
      toast({
        title: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  // Get current status config or default
  const currentStatus = orderDetails?.orderStatus || "pending";
  const StatusIcon = statusConfig[currentStatus]?.icon || statusConfig.default.icon;
  const statusColor = statusConfig[currentStatus]?.color || statusConfig.default.color;

  // Calculate order time ago
  const orderDate = orderDetails?.orderDate ? new Date(orderDetails.orderDate) : new Date();
  const timeAgo = formatDistanceToNow(orderDate, { addSuffix: true });

  const totalItems = orderDetails?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <DialogContent className="sm:max-w-[700px] overflow-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-6 py-4">
        {/* Order Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{orderDetails?._id?.substring(0, 8)}</h3>
                <p className="text-sm text-muted-foreground">Placed {timeAgo}</p>
              </div>
              <Badge className={`px-3 py-1.5 text-sm ${statusColor} border`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{orderDetails?.orderDate?.split("T")[0]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="font-medium">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium capitalize">{orderDetails?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium text-lg">${orderDetails?.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Order Items</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item, index) => (
                      <div key={index} className="flex items-center p-4 gap-4">
                        <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span className="mx-2">·</span>
                            <span>${parseFloat(item.price).toFixed(2)} each</span>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </div>
                      </div>
                    ))
                  : (
                    <div className="p-4 text-center text-muted-foreground">
                      No items in this order
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="font-medium">{user?.userName || "Customer"}</p>
                  <p>{orderDetails?.addressInfo?.address}</p>
                  <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
                  <p>Phone: {orderDetails?.addressInfo?.phone}</p>
                  {orderDetails?.addressInfo?.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-muted-foreground">Notes:</p>
                      <p className="text-sm">{orderDetails?.addressInfo?.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment method:</span>
                    <span className="font-medium capitalize">{orderDetails?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment status:</span>
                    <Badge variant={orderDetails?.paymentStatus === 'paid' ? 'success' : 'outline'}>
                      {orderDetails?.paymentStatus}
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total:</span>
                    <span>${orderDetails?.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Update Order Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>
          <Card>
            <CardContent className="p-6">
              <CommonForm
                formControls={[
                  {
                    label: "Order Status",
                    name: "status",
                    componentType: "select",
                    placeholder: "Select new status",
                    required: true,
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Update Status"}
                buttonClassName="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                onSubmit={handleUpdateStatus}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
