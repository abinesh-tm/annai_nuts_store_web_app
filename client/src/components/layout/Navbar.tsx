import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, HeartIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/features/auth/authSlice';
import logo from '../../assets/annai_nuts_logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-primary-dark text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div>Free Shipping on orders over ₹999 | Premium Quality Dry Fruits</div>
          <div className="flex gap-4">
            <Link to="/track-order" className="hover:text-peach">Track Order</Link>
            <Link to="/help" className="hover:text-peach">Help</Link>
            {user ? (
              <button onClick={handleLogout} className="hover:text-peach">Sign Out</button>
            ) : (
              <Link to="/login" className="hover:text-peach">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Anand Dry Fruits" className="h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary transition">Shop</Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary transition">Categories</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary transition">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary transition">Contact</Link>
            </div>

            {/* Search, Icons, and Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="outline-none text-sm w-48"
                />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4">
                <Link to="/wishlist" className="relative">
                  <HeartIcon className="w-6 h-6 text-gray-700 hover:text-primary" />
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-primary" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to={user ? "/profile" : "/login"} className="relative">
                  <UserIcon className="w-6 h-6 text-gray-700 hover:text-primary" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-2"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary">Shop</Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary">Categories</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary">Contact</Link>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="outline-none text-sm flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

