import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromWishlist } from "../../store/features/wishlist/wishlistSlice";
import { addToCart } from "../../store/features/cart/cartSlice";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlist(id));
    toast.info("Removed from wishlist");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist ❤️</h1>

      {items.length === 0 && (
        <p className="text-gray-600 text-lg">No products in your wishlist.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>

            <p className="text-xl font-bold text-primary mb-4">
              ₹{product.price}
            </p>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <Button
                variant="primary"
                onClick={() => handleAddToCart(product)}
                className="flex-1"
              >
                Add to Cart
              </Button>

              <button
                onClick={() => handleRemove(product._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

