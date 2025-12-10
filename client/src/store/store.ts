import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import productsReducer from './features/products/productsSlice';
import cartReducer from './features/cart/cartSlice';
import ordersReducer from './features/orders/ordersSlice';
import customersReducer from './features/customers/customersSlice';
import uiReducer from './features/ui/uiSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    customers: customersReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

