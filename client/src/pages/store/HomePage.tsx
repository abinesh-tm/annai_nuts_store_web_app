import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProducts } from '../../store/features/products/productsSlice';
import { addToCart } from '../../store/features/cart/cartSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import dryFruitsImage from '../../assets/dryFruits.svg';
import mixedNutsImage from '../../assets/mixedNuts.svg';
import nutsImage from '../../assets/nuts.svg';
import person1Image from '../../assets/person-1.jpg';
import person2Image from '../../assets/person-2.jpg';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4);
  const categories = [
    { name: 'Walnuts', image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=200' },
    { name: 'Pistachios', image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=200' },
    { name: 'Cashews', image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=200' },
    { name: 'Almonds', image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=200' },
    { name: 'Seeds', image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=200' },
  ];

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden h-80">
            <img
              src={dryFruitsImage}
              alt="Dry fruits"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">Premium Quality</h2>
                <p className="text-white mb-4">Fresh dry fruits delivered to your door</p>
                <Button>Shop Now</Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-36">
              <img
                src={nutsImage}
                alt="Nuts"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden h-36">
              <img
                src={mixedNutsImage}
                alt="Mixed nuts"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Shop by top categories</h2>
          <Link to="/categories" className="text-primary hover:text-primary-dark flex items-center gap-1">
            View All <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card key={category.name} hover className="text-center p-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-medium text-gray-900">{category.name}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-peach rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={person1Image}
                alt="Happy customer"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={person2Image}
                alt="Happy customer"
                className="w-full h-64 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">100% Trusted Dry Fruits Store</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span className="text-gray-700">Premium quality products sourced directly from farms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span className="text-gray-700">Hygienic packing ensuring freshness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span className="text-gray-700">Fast delivery across India</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span className="text-gray-700">100% satisfaction guarantee</span>
                </li>
              </ul>
              <Button>
                Shop Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-primary hover:text-primary-dark flex items-center gap-1">
            View All <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product._id} hover className="overflow-hidden">
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
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
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
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-peach rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wanna join the Chock fullo?</h2>
          <p className="text-gray-700 mb-6">Get exclusive offers, health tips, and new arrivals.</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;

