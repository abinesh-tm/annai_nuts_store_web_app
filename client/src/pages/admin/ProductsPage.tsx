import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Product } from "../../types";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useAppSelector, useAppDispatch } from "../../store/hooks";

import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../store/features/products/productsSlice";

import api from "../../services/api";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // NEW PRODUCT STATE (use strings, not numbers!)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  // EDIT PRODUCT STATE
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  // =================== BASE64 CONVERTER ===================
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // =============== IMAGE UPLOAD HANDLER (BASE64) ===============
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const base64 = await fileToBase64(file);

      const res = await api.post("/upload/base64", {
        imageBase64: base64,
      });

      return res.data.url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  // =============== ADD PRODUCT =================
  const handleAddProduct = async () => {
    try {
      const payload: Partial<Product> = {
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image: newProduct.image,
        description: newProduct.description,
        status:
          Number(newProduct.stock) === 0 ? "out of stock" : "active",
      };

      await dispatch(createProduct(payload)).unwrap();

      toast.success("Product added successfully!");

      setIsAddOpen(false);
      setNewProduct({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        image: "",
        description: "",
      });

      dispatch(fetchProducts());
    } catch (error: any) {
      toast.error(error || "Failed to add product");
    }
  };

  // =============== OPEN EDIT POPUP =================
  const openEditPopup = (product: Product) => {
    setEditProduct(product);
    setIsEditOpen(true);
  };

  // =============== UPDATE PRODUCT =================
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    try {
      const payload: Partial<Product> = {
        name: editProduct.name,
        sku: editProduct.sku,
        category: editProduct.category,
        price: Number(editProduct.price),
        stock: Number(editProduct.stock),
        image: editProduct.image,
        description: editProduct.description,
        status:
          Number(editProduct.stock) === 0 ? "out of stock" : "active",
      };

      await dispatch(
        updateProduct({ id: editProduct._id, data: payload })
      ).unwrap();

      toast.success("Product updated successfully!");
      setIsEditOpen(false);
      dispatch(fetchProducts());
    } catch (error: any) {
      toast.error(error || "Failed to update");
    }
  };

  // =============== DELETE PRODUCT =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 10) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>

        <Button variant="secondary" onClick={() => setIsAddOpen(true)}>
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add Product
        </Button>
      </div>

      {/* SEARCH BAR */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <Button variant="outline">
            <FunnelIcon className="w-5 h-5 inline mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* ADD PRODUCT POPUP */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>

            <div className="space-y-4">
              {/* IMAGE UPLOAD */}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const url = await uploadImage(file);
                  if (url) {
                    setNewProduct({ ...newProduct, image: url });
                    toast.success("Image uploaded!");
                  }
                }}
              />

              {/* IMAGE URL */}
              <input
                type="text"
                placeholder="Image URL"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />

              {/* FIELDS */}
              {["name", "sku", "category", "price", "stock"].map((field) => (
                <input
                  key={field}
                  type={
                    field === "price" || field === "stock" ? "number" : "text"
                  }
                  placeholder={field.toUpperCase()}
                  className="w-full border px-3 py-2 rounded"
                  value={(newProduct as any)[field]}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}

              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={handleAddProduct}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT POPUP */}
      {isEditOpen && editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const url = await uploadImage(file);
                  if (url) {
                    setEditProduct({ ...editProduct, image: url });
                    toast.success("Image updated!");
                  }
                }}
              />

              <input
                type="text"
                placeholder="Image URL"
                className="w-full border px-3 py-2 rounded"
                value={editProduct.image}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.value })
                }
              />

              {["name", "sku", "category", "price", "stock"].map((field) => (
                <input
                  key={field}
                  type={
                    field === "price" || field === "stock" ? "number" : "text"
                  }
                  placeholder={field.toUpperCase()}
                  className="w-full border px-3 py-2 rounded"
                  value={(editProduct as any)[field]}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}

              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={handleUpdateProduct}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT TABLE */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <Card>
          <Table
            headers={[
              "Product",
              "SKU",
              "Category",
              "Price",
              "Stock",
              "Status",
              "Actions",
            ]}
          >
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>

                <TableCell className={getStockColor(product.stock)}>
                  {product.stock}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={product.stock === 0 ? "default" : "success"}
                    className={
                      product.stock === 0 ? "bg-red-200 text-red-800" : ""
                    }
                  >
                    {product.stock === 0 ? "out of stock" : "active"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex gap-4">
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      onClick={() => openEditPopup(product)}
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    <button
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(product._id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;








