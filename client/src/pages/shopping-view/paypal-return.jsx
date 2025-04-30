<<<<<<< HEAD
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PayPalReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const capturePayment = async () => {
      const paymentId = searchParams.get("paymentId");
      const payerId = searchParams.get("PayerID");
      const orderId = localStorage.getItem("pendingOrderId");

      if (paymentId && payerId && orderId) {
        try {
          const response = await axios.post("http://localhost:5000/api/orders/capture-payment", {
            paymentId,
            payerId,
            orderId,
          });

          if (response.data.success) {
            alert("Payment successful! Your order has been placed.");
            localStorage.removeItem("pendingOrderId"); // Clear stored order ID
            navigate("/shop/orders"); // Redirect to order history page
          } else {
            alert("Payment failed. Please contact support.");
          }
        } catch (error) {
          console.error("Error capturing payment:", error);
          alert("An error occurred while processing your payment.");
        }
      }
    };

    capturePayment();
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default PayPalReturn;
=======
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { capturePayment } from "@/store/shop/order-slice";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";

// function PaypalReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("paymentId");
//   const payerId = params.get("PayerID");

//   useEffect(() => {
//     if (paymentId && payerId) {
//       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

//       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
//         if (data?.payload?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           window.location.href = "/shop/payment-success";
//         }
//       });
//     }
//   }, [paymentId, payerId, dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing Payment...Please wait!</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaypalReturnPage;
>>>>>>> main
