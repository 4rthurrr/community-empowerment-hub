import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart, Eye } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow group">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600">
              Sale
            </Badge>
          ) : null}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full h-8 w-8 bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">
            {categoryOptionsMap[product?.category] || product?.category}
          </div>
          <h2 className="text-lg font-bold mb-2 line-clamp-2">{product?.title}</h2>
          <div className="flex items-end gap-2 mt-3">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ${product?.salePrice}
                </span>
                <span className="text-sm font-medium text-gray-500 line-through">
                  ${product?.price}
                </span>
                <span className="text-xs font-medium text-emerald-600 ml-auto">
                  {Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}% off
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ${product?.price}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
