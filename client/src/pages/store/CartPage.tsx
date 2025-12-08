import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/features/cart/cartSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.product._id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.product.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 }));
                            if (item.quantity > 1) {
                              toast.info('Quantity updated');
                            }
                          }}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 }));
                            toast.info('Quantity updated');
                          }}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            dispatch(removeFromCart(item.product._id));
                            toast.success(`${item.product.name} removed from cart`);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={() => {
                dispatch(clearCart());
                toast.info('Cart cleared');
              }}>
                Clear Cart
              </Button>
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Link to="/products" className="block text-center text-primary mt-4 hover:text-primary-dark">
              Continue Shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

