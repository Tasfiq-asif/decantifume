"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { usePageLoading } from "@/lib/hooks/usePageLoading";

// Transform Redux product to ProductCard format
const transformProduct = (product: any) => ({
  id: product._id,
  name: product.name,
  brand: product.brand,
  description: product.description,
  price: product.decantSizes[0]?.price || 0,
  image: product.images[0] || product.thumbnail || "/placeholder-product.jpg",
  sizes: product.decantSizes.map((size: any) => ({
    id: `${product._id}-${size.size}`,
    size: size.size,
    price: size.price,
  })),
  isNew:
    new Date(product.createdAt) >
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  isBestSeller: product.averageRating >= 4.5 && product.totalReviews > 10,
});

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    filters,
    pagination,
    availableCategories,
    availableBrands,
    loadProducts,
    searchProducts,
    filterByCategory,
    filterByBrand,
    sortProducts,
    changePage,
    resetFilters,
  } = useProducts();

  const { setLoading } = usePageLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    setLoading(true, "Loading products...");
    loadProducts().finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      resetFilters();
    } else {
      filterByCategory(category);
    }
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
    if (brand === "all") {
      resetFilters();
    } else {
      filterByBrand(brand);
    }
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    const [field, order] = sortValue.split("-");
    sortProducts(field, order as "asc" | "desc");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSortBy("createdAt");
    resetFilters();
  };

  const hasActiveFilters =
    searchTerm || selectedCategory || selectedBrand || sortBy !== "createdAt";

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadProducts()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Collection</h1>
        <p className="text-muted-foreground">
          Discover premium fragrances from the world's finest perfume houses
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search perfumes, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={handleBrandFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="averageRating-desc">
                  Highest Rated
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button onClick={handleSearch} className="lg:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory("")}
                  />
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Brand: {selectedBrand}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedBrand("")}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {loading
            ? "Loading..."
            : `Showing ${products.length} of ${pagination.total} products`}
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all products
            </p>
            <Button onClick={clearAllFilters}>View All Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={transformProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(pagination.totalPages, 5) }).map(
            (_, i) => {
              const pageNumber = pagination.page - 2 + i;
              if (pageNumber < 1 || pageNumber > pagination.totalPages)
                return null;

              return (
                <Button
                  key={pageNumber}
                  variant={
                    pageNumber === pagination.page ? "default" : "outline"
                  }
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            }
          )}

          <Button
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
