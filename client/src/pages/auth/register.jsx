import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
  role: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validation functions
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.userName.trim()) {
      tempErrors.userName = "Username is required";
      isValid = false;
    } else if (formData.userName.length < 3) {
      tempErrors.userName = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      tempErrors.userName = "Username can only contain letters, numbers and underscores";
      isValid = false;
    }

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      isValid = false;
    }

    // Role validation
    if (!formData.role) {
      tempErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  function onSubmit(event) {
    event.preventDefault();
    
    // Validate form before submission
    if (validateForm()) {
      dispatch(registerUser(formData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      });
    } else {
      // Display validation errors
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
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        formErrors={errors}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
