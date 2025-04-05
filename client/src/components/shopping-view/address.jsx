import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const initialFormErrors = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  // Validate the form data
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Address validation (required)
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (formData.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters";
      isValid = false;
    } else if (formData.address.trim().length > 100) {
      errors.address = "Address should not exceed 100 characters";
      isValid = false;
    }

    // City validation (required)
    if (!formData.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.city.trim())) {
      errors.city = "City should contain only letters, spaces, hyphens and apostrophes";
      isValid = false;
    } else if (formData.city.trim().length > 50) {
      errors.city = "City name should not exceed 50 characters";
      isValid = false;
    }

    // Phone validation (required)
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        errors.phone = "Phone number should be between 8 and 15 digits";
        isValid = false;
      } else if (!/^[+\d\s\(\)-]+$/.test(formData.phone.trim())) {
        errors.phone = "Phone number contains invalid characters";
        isValid = false;
      }
    }

    // Pincode validation (required)
    if (!formData.pincode.trim()) {
      errors.pincode = "Postal/ZIP code is required";
      isValid = false;
    } else if (!/^\d{5,10}$/.test(formData.pincode.replace(/\s/g, ''))) {
      errors.pincode = "Please enter a valid postal/ZIP code (5-10 digits)";
      isValid = false;
    }

    // Notes validation (optional)
    if (formData.notes.trim() && formData.notes.trim().length > 200) {
      errors.notes = "Notes should not exceed 200 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  function handleManageAddress(event) {
    event.preventDefault();

    // Check if max address limit reached
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Submit form if validation passes
    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            setFormErrors(initialFormErrors);
            toast({
              title: "Address updated successfully",
            });
          } else {
            toast({
              title: "Failed to update address",
              variant: "destructive",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            setFormErrors(initialFormErrors);
            toast({
              title: "Address added successfully",
            });
          } else {
            toast({
              title: "Failed to add address",
              variant: "destructive",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
    // Reset errors when editing
    setFormErrors(initialFormErrors);
  }

  // Update isFormValid to use the same logic as validateForm
  function isFormValid() {
    return formData.address.trim() !== "" && 
           formData.city.trim() !== "" && 
           formData.phone.trim() !== "" && 
           formData.pincode.trim() !== "" &&
           Object.values(formErrors).every(x => x === "");
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.values(formErrors).some(error => error !== "") && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 mb-4">
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc list-inside mt-1">
              {Object.values(formErrors)
                .filter(error => error !== "")
                .map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
            </ul>
          </div>
        )}
        <CommonForm
          formControls={addressFormControls.map(control => ({
            ...control,
            error: formErrors[control.name]
          }))}
          formData={formData}
          formErrors={formErrors}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={false} // We'll handle validation in the submit handler
        />
      </CardContent>
    </Card>
  );
}

export default Address;
