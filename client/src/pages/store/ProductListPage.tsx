import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProducts } from '../../store/features/products/productsSlice';
import { addToCart } from '../../store/features/cart/cartSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} hover className="overflow-hidden">
            <Link to={`/products/${product._id}`}>
              <div className="relative">
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <HeartIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;

