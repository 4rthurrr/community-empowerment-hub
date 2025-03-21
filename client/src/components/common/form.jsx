import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "../ui/spinner";

const CommonForm = ({
  formControls = [],
  formData = {},
  setFormData,
  onSubmit,
  buttonText = "Submit",
  buttonClassName = "",
  formClassName = "",
  isLoading = false,
  formErrors = {},
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderFormControl = (control) => {
    const { type, name, label, placeholder, options = [], onChange } = control;
    
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              type={type}
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name] || ""}
              onChange={onChange || handleInputChange}
              className={formErrors[name] ? "border-red-500" : ""}
            />
            {formErrors[name] && (
              <p className="text-sm text-red-500">{formErrors[name]}</p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Textarea
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name] || ""}
              onChange={onChange || handleInputChange}
              className={formErrors[name] ? "border-red-500" : ""}
            />
            {formErrors[name] && (
              <p className="text-sm text-red-500">{formErrors[name]}</p>
            )}
          </div>
        );
      case "select":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Select
              value={formData[name] || ""}
              onValueChange={(value) => handleSelectChange(name, value)}
              name={name}
            >
              <SelectTrigger 
                id={name} 
                className={formErrors[name] ? "border-red-500" : ""}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors[name] && (
              <p className="text-sm text-red-500">{formErrors[name]}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit} className={formClassName}>
      {formControls.map((control) => renderFormControl(control))}
      <Button
        type="submit"
        className={buttonClassName}
        disabled={isLoading}
      >
        {isLoading ? <Spinner className="mr-2" /> : null}
        {buttonText}
      </Button>
    </form>
  );
};

export default CommonForm;
