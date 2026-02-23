/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Memoize the "new product" threshold to prevent hydration issues
  const newProductThreshold = useMemo(() => {
    // Calculate once on mount to be consistent between server and client
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }, []);

  // OPTIMIZED: Memoize the transform function to prevent recreation on every render
  const transformProduct = useCallback(
    (product: any) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.decantSizes[0]?.price || 0,
      image:
        product.images[0] || product.thumbnail || "/placeholder-product.jpg",
      sizes: product.decantSizes.map((size: any) => ({
        id: `${product._id}-${size.size}`,
        size: size.size,
        price: size.price,
      })),
      isNew: new Date(product.createdAt) > newProductThreshold,
      isBestSeller: product.averageRating >= 4.5 && product.totalReviews > 10,
    }),
    [newProductThreshold]
  );

  // OPTIMIZED: Memoize transformed products to prevent expensive recalculations
  const transformedProducts = useMemo(() => {
    return products.map(transformProduct);
  }, [products, transformProduct]);

  // OPTIMIZED: Initial load with reasonable limits
  useEffect(() => {
    // FIXED: Remove manual loading state - let Redux handle it
    loadProducts({
      limit: 12, // Start with smaller batch for faster initial load
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - we only want this to run once on mount

  // FIXED: Auto search - when typing, search automatically, when cleared, show all products
  useEffect(() => {
    if (searchTerm.trim()) {
      // For non-empty search terms, use debounce
      const timeoutId = setTimeout(() => {
        searchProducts(searchTerm);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // When search term is cleared, automatically show all products
      setSelectedCategory("");
      setSelectedBrand("");
      resetFilters();
      loadProducts({
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // Only depend on searchTerm to prevent infinite loops

  // OPTIMIZED: Memoize event handlers to prevent unnecessary re-renders
  const handleSearch = useCallback(() => {
    // Manual search - no debounce, immediate execution
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
    }
    // Note: Empty search is now handled automatically by useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // Only depend on searchTerm

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleCategoryFilter = useCallback(
    (category: string) => {
      if (category === "all") {
        // Reset all local state and Redux filters
        setSelectedCategory("");
        setSelectedBrand("");
        setSearchTerm("");
        resetFilters();
        // Load all products
        loadProducts({
          limit: 12,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
      } else {
        setSelectedCategory(category);
        filterByCategory(category);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [] // Remove unstable function dependencies
  );

  const handleBrandFilter = useCallback(
    (brand: string) => {
      if (brand === "all") {
        // Reset all local state and Redux filters
        setSelectedCategory("");
        setSelectedBrand("");
        setSearchTerm("");
        resetFilters();
        // Load all products
        loadProducts({
          limit: 12,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
      } else {
        setSelectedBrand(brand);
        filterByBrand(brand);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [] // Remove unstable function dependencies
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      sortProducts(field, order);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [] // Remove unstable function dependencies
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    resetFilters();
    // Load all products after clearing filters
    loadProducts({
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove unstable function dependencies

  // OPTIMIZED: Memoize computed values
  const hasActiveFilters = useMemo(() => {
    return searchTerm || selectedCategory || selectedBrand;
  }, [searchTerm, selectedCategory, selectedBrand]);

  const displayCategories = useMemo(() => {
    return availableCategories.slice(0, 6);
  }, [availableCategories]);

  const displayBrands = useMemo(() => {
    return availableBrands.slice(0, 8);
  }, [availableBrands]);

  if (error) {
    return (
      <SiteLayout>
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
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#c8a2ff] to-transparent rounded-full mb-3" />
          <p className="text-muted-foreground">
            Discover premium fragrances from the world&apos;s finest perfume
            houses
          </p>
        </div>

        {/* Search and Basic Filters */}
        <Card className="mb-8 glass-card border-[rgba(200,162,255,0.1)]">
          <CardContent className="p-6">
            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search perfumes, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-muted-foreground flex items-center">
                Sort by:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("createdAt", "desc")}
                className="hover:text-[#AA8EEC] transition-colors duration-200"
              >
                Newest
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("name", "asc")}
                className="hover:text-[#AA8EEC] transition-colors duration-200"
              >
                Name A-Z
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("averageRating", "desc")}
                className="hover:text-[#AA8EEC] transition-colors duration-200"
              >
                Rating
              </Button>
            </div>

            {/* Categories */}
            {displayCategories.length > 0 && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground block mb-2">
                  Categories:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("all")}
                    className={
                      selectedCategory === ""
                        ? ""
                        : "hover:text-[#AA8EEC] transition-colors duration-200"
                    }
                  >
                    All
                  </Button>
                  {displayCategories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryFilter(category)}
                      className={
                        selectedCategory === category
                          ? ""
                          : "hover:text-[#AA8EEC] transition-colors duration-200"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {displayBrands.length > 0 && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground block mb-2">
                  Popular Brands:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedBrand === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBrandFilter("all")}
                    className={
                      selectedBrand === ""
                        ? ""
                        : "hover:text-[#AA8EEC] transition-colors duration-200"
                    }
                  >
                    All
                  </Button>
                  {displayBrands.map((brand) => (
                    <Button
                      key={brand}
                      variant={selectedBrand === brand ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBrandFilter(brand)}
                      className={
                        selectedBrand === brand
                          ? ""
                          : "hover:text-[#AA8EEC] transition-colors duration-200"
                      }
                    >
                      {brand}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: {searchTerm}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSearchTerm("");
                        // If no other filters, load all products
                        if (!selectedCategory && !selectedBrand) {
                          resetFilters();
                          loadProducts({
                            limit: 12,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          });
                        }
                      }}
                    />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Category: {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory("");
                        // If no other filters, load all products
                        if (!searchTerm && !selectedBrand) {
                          resetFilters();
                          loadProducts({
                            limit: 12,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          });
                        } else {
                          // Apply remaining filters
                          const remainingFilters: any = {};
                          if (searchTerm)
                            remainingFilters.searchTerm = searchTerm;
                          if (selectedBrand)
                            remainingFilters.brand = selectedBrand;
                          loadProducts({
                            ...remainingFilters,
                            limit: 12,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          });
                        }
                      }}
                    />
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Brand: {selectedBrand}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSelectedBrand("");
                        // If no other filters, load all products
                        if (!searchTerm && !selectedCategory) {
                          resetFilters();
                          loadProducts({
                            limit: 12,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          });
                        } else {
                          // Apply remaining filters
                          const remainingFilters: any = {};
                          if (searchTerm)
                            remainingFilters.searchTerm = searchTerm;
                          if (selectedCategory)
                            remainingFilters.category = selectedCategory;
                          loadProducts({
                            ...remainingFilters,
                            limit: 12,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          });
                        }
                      }}
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
          // OPTIMIZED: Reduced skeleton cards from 8 to 4 for faster perceived loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse glass-card border-[rgba(200,162,255,0.08)]">
                <div className="aspect-square bg-muted/50 rounded-t-xl"></div>
                <CardContent className="p-4">
                  <div className="h-3 bg-muted/50 rounded mb-3 w-1/3"></div>
                  <div className="h-4 bg-muted/50 rounded mb-2"></div>
                  <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || selectedCategory || selectedBrand
                  ? "Products not found"
                  : "No products available"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory || selectedBrand
                  ? `No products match your search criteria "${
                      searchTerm || selectedCategory || selectedBrand
                    }". Try adjusting your search or browse all products.`
                  : "No products are currently available. Please check back later."}
              </p>
              <Button onClick={clearAllFilters}>View All Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* OPTIMIZED: Use pre-transformed products to prevent re-calculations */}
            {transformedProducts.map((product, index) => (
              <ProductCard key={products[index]._id} product={product} />
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
    </SiteLayout>
  );
}
