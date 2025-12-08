import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';
import { Customer } from '../../../types';

interface CustomersState {
  customers: Customer[];
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  customer: null,
  isLoading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (search?: string, { rejectWithValue }) => {
    try {
      const params = search ? `?search=${search}` : '';
      const response = await api.get(`/customers${params}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.customer = action.payload;
      });
  },
});

export default customersSlice.reducer;

