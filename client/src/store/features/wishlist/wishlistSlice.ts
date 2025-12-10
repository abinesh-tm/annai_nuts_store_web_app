import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [] as any[],
  },
  reducers: {
    addToWishlist: (state, action: PayloadAction<any>) => {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    }
  }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
