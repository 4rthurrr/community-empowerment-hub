import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

{
  /* JOB FUNCTION ROUTE */
}
{
  /* -----Admin----- */
}
import AllJobPostAdmin from "./pages/JobFunction/Admin/AllJobPostAdmin";
import AppliedUsersDetails from "./pages/JobFunction/Admin/AppliedUsersDetails";
import AddBusinessManager from "./pages/JobFunction/Admin/AddBusinessManager";
import AllBusinessManagers from "./pages/JobFunction/Admin/AllBusinessManagers";
import JobAdminLogin from "./pages/JobFunction/Admin/JobAdminLogin";
import UpdateBusinessManager from "./pages/JobFunction/Admin/UpdateBusinessManager";
{
  /* -----Business----- */
}
import AddJobPost from "./pages/JobFunction/Business/AddJobPost";
import AllApplications from "./pages/JobFunction/Business/AllApplications";
import JobPostDetails from "./pages/JobFunction/Business/JobPostDetails";
import UpdatePost from "./pages/JobFunction/Business/UpdatePost";
import BusinessManagerLogin from "./pages/JobFunction/Business/BusinessManagerLogin";
import ViewJobPost from "./pages/JobFunction/Business/JobPostView";
{
  /* -----JobSeeker----- */
}
import AllJobDetails from "./pages/JobFunction/Jobseeker/AllJobDetails";
import ApplyForJob from "./pages/JobFunction/Jobseeker/ApplyForJob";
import JobSeekerLogin from "./pages/JobFunction/Jobseeker/JobSeekerLogin";
import JobSeekerRegister from "./pages/JobFunction/Jobseeker/JobSeekerRegister";
import ViewJobPoster from "./pages/JobFunction/Jobseeker/ViewJobPoster";
{
  /* -----JobFunctionHome----- */
}
import JobFunctionHome from "./pages/JobFunction/JobFunctionHome/JobFunctionHome";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />

        {/* JOB FUNCTION ROUTE */}
        {/* -----Admin----- */}
        <Route path="/allJobPostAdmin" element={<AllJobPostAdmin />} />
        <Route path="/appliedUsersDetails" element={<AppliedUsersDetails />} />
        <Route path="/addBusinessManager" element={<AddBusinessManager />} />
        <Route path="/allBusinessManagers" element={<AllBusinessManagers />} />
        <Route path="/jobAdminLogin" element={<JobAdminLogin />} />
        <Route
          path="/updateBusinessManager/:id"
          element={<UpdateBusinessManager />}
        />

        {/* -----Business----- */}
        <Route path="/addJobPost" element={<AddJobPost />} />
        <Route path="/allJobApplication" element={<AllApplications />} />
        <Route path="/jobPostDetails" element={<JobPostDetails />} />
        <Route path="/updateJobPost/:id" element={<UpdatePost />} />
        <Route path="/viewJobPost/:id" element={<ViewJobPost />} />
        <Route
          path="/businessManagerLogin"
          element={<BusinessManagerLogin />}
        />

        {/* -----JobSeeker----- */}
        <Route path="/allJobDetails" element={<AllJobDetails />} />
        <Route path="/applyForJob" element={<ApplyForJob />} />
        <Route path="/jobSeekerLogin" element={<JobSeekerLogin />} />
        <Route path="/jobSeekerRegister" element={<JobSeekerRegister />} />
        <Route path="/viewJobPoster/:id" element={<ViewJobPoster />} />

        {/* -----Business----- */}
        <Route path="/jobFunctionHome" element={<JobFunctionHome />} />
      </Routes>
    </div>
  );
}

export default App;
