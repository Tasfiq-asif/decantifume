"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Package,
  DollarSign,
  Archive,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProducts,
  setFilters,
  clearFilters,
  clearError,
} from "@/redux/slices/productSlice";
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductFilters,
  selectProductPagination,
} from "@/redux/selectors";

import { Button } from "@/components/ui/button";
import { HeroButton } from "@/components/ui/hero-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePageLoading } from "@/lib/hooks/usePageLoading";
import api from "@/lib/api/axios";

// Types
interface DecantSize {
  size: string;
  price: number;
  stock: number;
  isAvailable?: boolean;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  decantSizes: DecantSize[];
  images: string[];
  thumbnail?: string;
  status: string;
  totalStock: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  description: string;
  category: string;
  decantSizes: DecantSize[];
  images: string[];
  thumbnail: string;
  tags: string[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Categories
const CATEGORIES = [
  { value: "mens_fragrance", label: "Men's Fragrance" },
  { value: "womens_fragrance", label: "Women's Fragrance" },
  { value: "unisex_fragrance", label: "Unisex Fragrance" },
  { value: "niche_fragrance", label: "Niche Fragrance" },
  { value: "designer_fragrance", label: "Designer Fragrance" },
];

// Available decant sizes with descriptions
const DECANT_SIZES = [
  {
    value: "2ml",
    label: "2ml",
    description: "Sample size - Perfect for testing",
  },
  { value: "5ml", label: "5ml", description: "Travel size - 1-2 weeks of use" },
  {
    value: "10ml",
    label: "10ml",
    description: "Popular size - 3-4 weeks of use",
  },
  {
    value: "15ml",
    label: "15ml",
    description: "Medium size - 1-2 months of use",
  },
  {
    value: "20ml",
    label: "20ml",
    description: "Large size - 2-3 months of use",
  },
  {
    value: "30ml",
    label: "30ml",
    description: "Extra large - 3-4 months of use",
  },
];

// Initial form data
const initialFormData: ProductFormData = {
  name: "",
  brand: "",
  description: "",
  category: "",
  decantSizes: [{ size: "5ml", price: 0, stock: 0, isAvailable: true }],
  images: [],
  thumbnail: "",
  tags: [],
};

// Product Form Dialog Component
const ProductFormDialog = ({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  handleSubmit,
  handleImageUpload,
  uploadingImage,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: () => void;
  handleRemoveTag: (index: number) => void;
}) => {
  const addDecantSize = () => {
    setFormData((prev) => ({
      ...prev,
      decantSizes: [
        ...prev.decantSizes,
        { size: "5ml", price: 0, stock: 0, isAvailable: true },
      ],
    }));
  };

  const removeDecantSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      decantSizes: prev.decantSizes.filter((_, i) => i !== index),
    }));
  };

  const updateDecantSize = (
    index: number,
    field: keyof DecantSize,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      decantSizes: prev.decantSizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingProduct
              ? "Update product information and pricing"
              : "Create a new decant product with multiple sizes and prices"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Product Information */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-lavender-300 mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Aventus, Sauvage, Black Orchid"
                  required
                  className="bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lavender-300 mb-2">
                  Brand *
                </label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  placeholder="e.g., Creed, Dior, Tom Ford"
                  required
                  className="bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-lavender-300 mb-2">
                Description *
              </label>
              <textarea
                className="w-full p-3 border border-white/10 rounded-lg resize-none bg-black/20 text-white placeholder:text-lavender-300 focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the fragrance, its notes, and what makes it special..."
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-lavender-300 mb-2">
                Category *
              </label>
              <select
                className="w-full p-3 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Decant Sizes & Pricing */}
          <div className="bg-lavender-900/20 backdrop-blur-sm border border-lavender-500/20 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Decant Sizes & Pricing
                </h3>
                <p className="text-sm text-lavender-300 mt-1">
                  Add different sizes with their respective prices and stock
                  quantities
                </p>
              </div>
              <HeroButton
                type="button"
                onClick={addDecantSize}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Size
              </HeroButton>
            </div>

            <div className="space-y-4">
              {formData.decantSizes.map((decantSize, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Size Selection */}
                    <div>
                      <label className="block text-xs font-medium text-lavender-300 mb-2">
                        Bottle Size
                      </label>
                      <select
                        className="w-full p-2.5 border border-white/10 rounded-md bg-black/20 text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
                        value={decantSize.size}
                        onChange={(e) =>
                          updateDecantSize(index, "size", e.target.value)
                        }
                        required
                      >
                        {DECANT_SIZES.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-medium text-lavender-300 mb-2">
                        Price (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lavender-400 text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={decantSize.price}
                          onChange={(e) =>
                            updateDecantSize(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                          required
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-medium text-lavender-300 mb-2">
                        Stock Quantity
                      </label>
                      <div className="relative">
                        <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lavender-400 w-4 h-4" />
                        <Input
                          type="number"
                          min="0"
                          value={decantSize.stock}
                          onChange={(e) =>
                            updateDecantSize(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                          required
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-end justify-center">
                      {formData.decantSizes.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDecantSize(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-400/20"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Size Summary */}
                  <div className="mt-3 p-3 bg-black/20 rounded-md">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">
                        {decantSize.size} bottle
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-green-400 font-semibold">
                          ${decantSize.price}
                        </span>
                        <span className="text-lavender-300">
                          {decantSize.stock} in stock
                        </span>
                        {decantSize.stock < 5 && decantSize.stock > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs bg-red-500/20 text-red-400 border-red-400/20"
                          >
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {formData.decantSizes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>
                  No sizes added yet. Click &ldquo;Add Size&rdquo; to get
                  started.
                </p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Product Images
            </h3>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-lavender-400/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-12 h-12 text-lavender-400 mb-3" />
                <span className="text-lg font-medium text-white mb-1">
                  {uploadingImage ? "Uploading..." : "Upload Product Images"}
                </span>
                <span className="text-sm text-lavender-300">
                  Click to select multiple images or drag and drop
                </span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-lavender-300 mb-3">
                  Uploaded Images ({formData.images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs bg-blue-600">
                          Thumbnail
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Product Tags (Optional)
            </h3>

            <div className="flex gap-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., woody, fresh, summer)"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
              />
              <HeroButton
                type="button"
                onClick={handleAddTag}
                variant="secondary"
                size="sm"
              >
                Add Tag
              </HeroButton>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <HeroButton
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
            >
              Cancel
            </HeroButton>
            <HeroButton
              type="submit"
              disabled={uploadingImage}
              variant="primary"
              size="md"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </HeroButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { withLoading } = usePageLoading();

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectProductFilters);
  const pagination = useSelector(selectProductPagination);

  // Local states (form and UI specific)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [newTag, setNewTag] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Local search and filter states
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localCategoryFilter, setLocalCategoryFilter] = useState("");

  // Authentication check
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }
  }, [status, session?.user?.role, router]);

  // Load products using Redux when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      // Initial load with admin-specific filters
      dispatch(
        fetchProducts({
          limit: 50, // Load more products for admin
          sortBy: "updatedAt",
          sortOrder: "desc",
        })
      );

      toast.success("Admin products page loaded!");
    }
  }, [status, session?.user?.role, dispatch]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      toast.error(`Error loading products: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters = {
        searchTerm: localSearchTerm || undefined,
        category: localCategoryFilter || undefined,
        limit: 50,
        sortBy: "updatedAt",
        sortOrder: "desc" as const,
      };

      dispatch(setFilters(newFilters));
      dispatch(fetchProducts(newFilters));
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, localCategoryFilter, dispatch]);

  // Refresh products function
  const refreshProducts = useCallback(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.decantSizes.length === 0) {
      toast.error("Please add at least one decant size");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    await withLoading(
      async () => {
        try {
          const productData = {
            ...formData,
            thumbnail: formData.images[0],
          };

          if (editingProduct) {
            await api.patch(`/products/${editingProduct._id}`, productData);
            toast.success("Product updated successfully!");
          } else {
            await api.post("/products", productData);
            toast.success("Product created successfully!");
          }

          setIsDialogOpen(false);
          setEditingProduct(null);
          setFormData(initialFormData);

          // Refresh products after create/update
          refreshProducts();
        } catch (error: unknown) {
          const apiError = error as ApiError;
          console.error("Error saving product:", apiError);
          toast.error(
            apiError.response?.data?.message || "Failed to save product"
          );
        }
      },
      editingProduct ? "Updating product..." : "Creating product..."
    );
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    await withLoading(async () => {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await api.post("/products/upload/single", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          return response.data.data.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));

        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Error uploading images:", apiError);
        toast.error(
          apiError.response?.data?.message || "Failed to upload images"
        );
      } finally {
        setUploadingImage(false);
      }
    }, "Uploading images...");
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    toast.custom(
      (t) => (
        <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Delete Product</h3>
              <p className="text-lavender-300 text-sm mb-3">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  &ldquo;{product.name}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <HeroButton
                  size="sm"
                  variant="secondary"
                  onClick={() => toast.dismiss(t)}
                >
                  Cancel
                </HeroButton>
                <HeroButton
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    toast.dismiss(t);
                    confirmDelete(product._id);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </HeroButton>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  const confirmDelete = async (productId: string) => {
    await withLoading(async () => {
      try {
        await api.delete(`/products/${productId}`);
        toast.success("Product deleted successfully!");
        refreshProducts();
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Error deleting product:", apiError);
        toast.error(
          apiError.response?.data?.message || "Failed to delete product"
        );
      }
    }, "Deleting product...");
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      category: product.category,
      decantSizes: product.decantSizes,
      images: product.images,
      thumbnail: product.thumbnail || "",
      tags: product.tags || [],
    });
    setIsDialogOpen(true);
  };

  // Handle add new product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  // Tag management
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Calculate statistics from Redux state
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.totalStock < 10).length,
    totalValue: products.reduce((sum, p) => {
      const minPrice = Math.min(...p.decantSizes.map((d) => d.price));
      return sum + minPrice * p.totalStock;
    }, 0),
  };

  // Show loading or access denied
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600 mx-auto mb-4"></div>
          <p className="text-lavender-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-lavender-300">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-lavender-300 mt-1">
            Manage your decant products, sizes, and pricing
          </p>
        </div>
        <div className="flex gap-3">
          <HeroButton
            onClick={refreshProducts}
            variant="secondary"
            size="md"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Refresh
          </HeroButton>
          <HeroButton
            onClick={handleAddProduct}
            variant="primary"
            size="md"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </HeroButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-lavender-300">
              Total Products
            </CardTitle>
            <Package className="w-4 h-4 text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : stats.total}
            </div>
            <p className="text-xs text-lavender-300 mt-1">
              {pagination.total} total in database
            </p>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-lavender-300">
              Active Products
            </CardTitle>
            <Archive className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {loading ? "..." : stats.active}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-lavender-300">
              Low Stock
            </CardTitle>
            <Archive className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {loading ? "..." : stats.lowStock}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-lavender-300">
              Inventory Value
            </CardTitle>
            <DollarSign className="w-4 h-4 text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lavender-400">
              {loading ? "..." : `$${stats.totalValue.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lavender-400 w-4 h-4" />
                <Input
                  placeholder="Search products by name or brand..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={localCategoryFilter}
                onChange={(e) => setLocalCategoryFilter(e.target.value)}
                className="w-full p-2 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filters.searchTerm && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-lavender-300">Active filters:</span>
              <Badge
                variant="secondary"
                className="bg-lavender-600/20 text-lavender-300"
              >
                Search: {filters.searchTerm}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setLocalSearchTerm("");
                    dispatch(setFilters({ searchTerm: undefined }));
                  }}
                />
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
        <CardContent className="p-0">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lavender-600 mr-2"></div>
              <span className="text-lavender-300">Loading products...</span>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-lavender-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No products found
              </h3>
              <p className="text-lavender-300 mb-4">
                {filters.searchTerm || filters.category
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first product"}
              </p>
              <HeroButton onClick={handleAddProduct} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </HeroButton>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-black/30 border-white/10">
                    <TableHead className="font-semibold text-white">
                      Product
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Brand
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Sizes & Prices
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Total Stock
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-white/10">
                              <AvatarImage
                                src={product.thumbnail || product.images[0]}
                              />
                              <AvatarFallback className="bg-black/20 text-lavender-300">
                                {product.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-lavender-300">
                                {product.description.slice(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {product.brand}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-lavender-500/20 text-lavender-300 border-lavender-400/20"
                          >
                            {CATEGORIES.find(
                              (c) => c.value === product.category
                            )?.label || product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {product.decantSizes
                              .slice(0, 3)
                              .map((size, index) => (
                                <div
                                  key={index}
                                  className="text-sm flex items-center gap-2"
                                >
                                  <span className="font-medium text-white">
                                    {size.size}
                                  </span>
                                  <span className="text-lavender-300">-</span>
                                  <span className="text-green-400 font-semibold">
                                    ${size.price}
                                  </span>
                                </div>
                              ))}
                            {product.decantSizes.length > 3 && (
                              <div className="text-xs text-lavender-400">
                                +{product.decantSizes.length - 3} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.totalStock < 10
                                ? "destructive"
                                : "default"
                            }
                            className={
                              product.totalStock < 10
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {product.totalStock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              product.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                              className="hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteProduct(product);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-400/20 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
        newTag={newTag}
        setNewTag={setNewTag}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
      />
    </div>
  );
}
