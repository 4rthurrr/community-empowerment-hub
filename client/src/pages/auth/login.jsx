import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validation function
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      tempErrors.email = "Invalid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  function onSubmit(event) {
    event.preventDefault();

    // Validate form before submission
    if (validateForm()) {
      dispatch(loginUser(formData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
          });
          // Redirect to dashboard or home page after successful login
          navigate("/");
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      });
    } else {
      // Display validation error toast
      toast({
        title: "Please fix the form errors",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        formErrors={errors}  // Pass the errors to CommonForm
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
