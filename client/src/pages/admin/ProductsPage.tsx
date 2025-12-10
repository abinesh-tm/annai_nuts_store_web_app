import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  fetchProducts,
  deleteProduct,
} from "../../store/features/products/productsSlice";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";


const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Add Product Popup State
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchProducts({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(error || "Failed to delete product");
      }
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 10) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div>
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory
          </p>
        </div>

        {/* OPEN POPUP */}
        <Button variant="secondary" onClick={() => setIsAddOpen(true)}>
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add Product
        </Button>
      </div>

      {/* SEARCH BAR */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="SKU"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Category"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Image URL"
                className="w-full border px-3 py-2 rounded"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />

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

              {/* SAVE PRODUCT */}
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={() => {
                  console.log("NEW PRODUCT ➜", newProduct);
                  toast.success("Product added!");
                  setIsAddOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT TABLE */}
      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <Card className="overflow-hidden">
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
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-gray-600">
                    {product.sku}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-gray-600">
                    {product.category}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`font-medium ${getStockColor(
                      product.stock
                    )}`}
                  >
                    {product.stock}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      product.status === "active" ? "success" : "default"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => handleDelete(product._id)}
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
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


