import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProducts, deleteProduct } from '../../store/features/products/productsSlice';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 10) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Button variant="secondary">
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add Product
        </Button>
      </div>

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

      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <Card className="overflow-hidden">
          <Table headers={['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
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
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.sku}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${getStockColor(product.stock)}`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'success' : 'default'}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button className="text-gray-600 hover:text-gray-900">
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

