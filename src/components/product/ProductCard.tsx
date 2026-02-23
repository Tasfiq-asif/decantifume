"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/hooks/reduxHooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  sizes: Array<{
    id: string;
    size: string;
    price: number;
  }>;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ProductCardProps {
  product: Product;
}

// OPTIMIZED: Memoized ProductCard to prevent unnecessary re-renders
export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    const size = selectedSize || (product.sizes[0]?.size ?? "");
    const selectedSizeData = product.sizes.find((s) => s.size === size);
    const price = selectedSizeData?.price || product.price;

    setIsAdding(true);

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        size: size,
      })
    );

    // Show toast notification
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${size} - $${price.toFixed(2)}`,
    });

    // Reset button state
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const currentPrice = selectedSize
    ? product.sizes.find((s) => s.size === selectedSize)?.price || product.price
    : product.price;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:glow-soft cursor-pointer border-[rgba(200,162,255,0.08)] hover:border-[rgba(200,162,255,0.2)]">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <Badge variant="default" className="bg-[#c8a2ff] text-[#0f0f1a] text-xs font-semibold">
              New
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="secondary" className="text-xs font-semibold bg-[#2e2e4a] text-[#e6d9ff] border border-[#c8a2ff]/20">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 " />

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <div className="flex flex-col gap-3">
            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full bg-white text-black border-0 h-9 text-sm font-medium">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size.id} value={size.size}>
                      {size.size} - ${size.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-primary hover:bg-primary/90 text-white border-0 h-9 font-medium"
              >
                {isAdding ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.brand}
        </div>
        <h3 className="font-medium leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">
            ${currentPrice.toFixed(2)}
            {product.sizes.length > 1 && !selectedSize && (
              <span className="text-xs text-muted-foreground ml-1">
                from $
                {Math.min(...product.sizes.map((s) => s.price)).toFixed(2)}
              </span>
            )}
          </div>
          {product.sizes.length > 1 && (
            <div className="text-xs text-muted-foreground">
              {product.sizes.length} sizes
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
