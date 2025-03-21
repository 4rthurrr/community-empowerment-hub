import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { categoryOptionsMap } from "@/config";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  // Calculate sale percentage if applicable
  const discountPercentage = product?.salePrice > 0 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[200px] object-cover"
        />
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product?.totalStock === 0 && (
            <Badge variant="destructive" className="px-2 py-1">
              Out of Stock
            </Badge>
          )}
          {product?.salePrice > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 py-1">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-white/80 text-xs">
            {categoryOptionsMap[product?.category] || product?.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="font-semibold line-clamp-1 text-lg">{product?.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product?.description}</p>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-end justify-between">
            <div>
              {product?.salePrice > 0 ? (
                <div className="flex flex-col">
                  <span className="line-through text-gray-500 text-sm">${product?.price}</span>
                  <span className="text-lg font-bold text-primary">${product?.salePrice}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">${product?.price}</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Stock: {product?.totalStock}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t p-3 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="flex items-center gap-1"
        >
          <Edit size={14} />
          Edit
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(product?._id)}
          className="flex items-center gap-1"
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default AdminProductTile;
