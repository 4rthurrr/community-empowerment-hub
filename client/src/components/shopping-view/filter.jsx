import { filterOptions, subcategoryOptionsMap } from "@/config";
import { Fragment, useMemo } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  // Get currently selected categories (if any)
  const selectedCategories = filters?.category || [];
  
  // Create dynamic subcategory options based on selected categories
  const dynamicSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) {
      // If no categories selected, show all subcategories
      return filterOptions.subcategory;
    }
    
    // Collect relevant subcategories for selected categories
    let relevantSubcategories = [];
    selectedCategories.forEach(category => {
      const categorySubcategories = subcategoryOptionsMap[category] || [];
      relevantSubcategories = [...relevantSubcategories, ...categorySubcategories];
    });
    
    // If no relevant subcategories found, show all subcategories
    return relevantSubcategories.length > 0 ? relevantSubcategories : filterOptions.subcategory;
  }, [selectedCategories]);

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Category filter section */}
        <Fragment>
          <div>
            <h3 className="text-base font-bold">Category</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions.category.map((option) => (
                <Label key={option.id} className="flex font-medium items-center gap-2 ">
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters.category &&
                      filters.category.indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter("category", option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
          <Separator />
        </Fragment>

        {/* Subcategory filter section - now using dynamic subcategories */}
        <Fragment>
          <div>
            <h3 className="text-base font-bold">Subcategory</h3>
            <div className="grid gap-2 mt-2">
              {dynamicSubcategories.map((option) => (
                <Label key={option.id} className="flex font-medium items-center gap-2 ">
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters.subcategory &&
                      filters.subcategory.indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter("subcategory", option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
          <Separator />
        </Fragment>
      </div>
    </div>
  );
}

export default ProductFilter;
