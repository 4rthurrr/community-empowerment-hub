import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  formErrors = {},
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  formClassName = "",
  buttonClassName = "",
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const hasError = !!formErrors[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              // Add min attribute for number fields to prevent negative values
              min={getControlItem.type === "number" ? (getControlItem.min || "0") : undefined}
              onChange={(event) => {
                // For number inputs, prevent negative values
                if (getControlItem.type === "number" && 
                    event.target.value !== "" && 
                    parseFloat(event.target.value) < 0) {
                  event.target.value = "0";
                }
                
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                });
              }}
              className={hasError ? "border-red-500" : ""}
            />
            {/* Help text below the field if provided */}
            {getControlItem.helpText && !hasError && (
              <p className="text-xs text-gray-500 mt-1">{getControlItem.helpText}</p>
            )}
          </>
        );
        break;
        
      case "select":
        element = (
          <>
            <Select
              onValueChange={(value) => {
                if (getControlItem.onChange) {
                  // Use custom onChange handler if provided
                  getControlItem.onChange({ target: { value } });
                } else {
                  // Default behavior
                  setFormData({
                    ...formData,
                    [getControlItem.name]: value,
                  });
                }
              }}
              value={value}
            >
              <SelectTrigger 
                className={`w-full ${hasError ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder={getControlItem.placeholder || getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {/* Help text below the field if provided */}
            {getControlItem.helpText && !hasError && (
              <p className="text-xs text-gray-500 mt-1">{getControlItem.helpText}</p>
            )}
          </>
        );
        break;
        
      case "textarea":
        element = (
          <>
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id || getControlItem.name}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
            {/* Help text below the field if provided */}
            {getControlItem.helpText && !hasError && (
              <p className="text-xs text-gray-500 mt-1">{getControlItem.helpText}</p>
            )}
          </>
        );
        break;

      default:
        element = (
          <>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              min={getControlItem.type === "number" ? "0" : undefined}
              value={value}
              onChange={(event) => {
                // For number inputs, prevent negative values
                if (getControlItem.type === "number" && 
                    event.target.value !== "" && 
                    parseFloat(event.target.value) < 0) {
                  event.target.value = "0";
                }
                
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                });
              }}
              className={hasError ? "border-red-500" : ""}
            />
            {/* Help text below the field if provided */}
            {getControlItem.helpText && !hasError && (
              <p className="text-xs text-gray-500 mt-1">{getControlItem.helpText}</p>
            )}
          </>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit} className={formClassName}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1" htmlFor={controlItem.name}>
              {controlItem.label}
              {controlItem.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderInputsByComponentType(controlItem)}
            {/* Add error message if there's an error for this field */}
            {formErrors[controlItem.name] && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors[controlItem.name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <Button 
        disabled={isBtnDisabled} 
        type="submit" 
        className={`mt-4 ${buttonClassName}`}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
