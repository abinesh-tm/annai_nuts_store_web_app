import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProductById } from '../../store/features/products/productsSlice';
import { addToCart } from '../../store/features/cart/cartSlice';
import Button from '../../components/common/Button';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, isLoading } = useAppSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      navigate('/cart');
    }
  };

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
              <span className="ml-2 text-gray-600">({product.numReviews || 0} reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>SKU:</strong> {product.sku}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-16 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
              Add to Cart
            </Button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <HeartIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

