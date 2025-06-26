"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
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

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
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

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 500);
  };

  const currentPrice = selectedSize
    ? product.sizes.find((s) => s.size === selectedSize)?.price || product.price
    : product.price;

  return (
    <Card
      className="group overflow-hidden border-none bg-transparent shadow-none transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="default" className="bg-primary text-white">
              New
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="secondary">Best Seller</Badge>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Size Selection */}
          {product.sizes.length > 1 && (
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="bg-background/90 backdrop-blur-sm">
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
              variant="default"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1"
            >
              {isAdding ? (
                "Adding..."
              ) : justAdded ? (
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
            <Button size="sm" variant="outline" className="bg-background/80">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4 pt-6">
        <div className="text-xs text-muted-foreground mb-1">
          {product.brand}
        </div>
        <Link
          href={`/product/${product.id}`}
          className="group-hover:text-primary"
        >
          <h3 className="font-medium leading-tight mb-2">{product.name}</h3>
        </Link>
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
}
