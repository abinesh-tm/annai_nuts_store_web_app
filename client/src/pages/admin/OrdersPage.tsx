import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, EyeIcon, TruckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders } from '../../store/features/orders/ordersSlice';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

type OrderItem = {
  _id?: string;
  product?: string | { _id: string; name?: string; image?: string; price?: number };
  name?: string;
  quantity: number;
  price: number;
  image?: string;
};

type UserRef = { _id?: string; name?: string; email?: string } | string | null;

type OrderType = {
  _id: string;
  user: UserRef;
  orderItems: OrderItem[];
  shippingAddress?: any;
  paymentMethod?: string;
  itemsPrice?: number;
  shippingPrice?: number;
  taxPrice?: number;
  totalPrice?: number;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  shipmentId?: string;
  [k: string]: any;
};

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [editOrder, setEditOrder] = useState<OrderType | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [shipmentId, setShipmentId] = useState<string>('');
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'info' | 'warning' | 'default' } = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'default',
      cancelled: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (orders || []).filter((order: OrderType) => {
      const orderId = String(order._id || '').toLowerCase();
      const customerName =
        typeof order.user === 'object' && order.user ? (order.user as any).name?.toLowerCase() || '' : '';

      const matchesSearch =
        !term || orderId.includes(term) || customerName.includes(term);

      const matchesStatus =
        statusFilter === 'All' || (order.status || '').toLowerCase() === statusFilter.toLowerCase();

      const orderDate = order.createdAt ? new Date(order.createdAt) : null;
      const matchesFrom = dateFrom ? (orderDate ? orderDate >= new Date(dateFrom) : true) : true;
      const matchesTo = dateTo ? (orderDate ? orderDate <= new Date(dateTo) : true) : true;

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo]);

  const handleShipQuick = async (orderId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: 'shipped' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to update order`);
      }
      toast.success('Order marked as shipped');
      await dispatch(fetchOrders());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to ship order');
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (order: OrderType) => {
    setEditOrder(order);
    setNewStatus(order.status || 'pending');
    setShipmentId(order.shipmentId || '');
  };

  const handleSaveStatus = async () => {
    if (!editOrder) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${editOrder._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: newStatus, shipmentId: shipmentId || undefined }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to update status');
      }

      toast.success('Order updated');
      setEditOrder(null);
      await dispatch(fetchOrders());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to update order');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteOrderId) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${deleteOrderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to delete order');
      }
      toast.success('Order deleted');
      setDeleteOrderId(null);
      await dispatch(fetchOrders());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to delete order');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCustomerName = (order: OrderType) => {
    if (!order.user) return 'Customer';
    return typeof order.user === 'object' ? (order.user as any).name || 'Customer' : 'Customer';
  };
  const getCustomerEmail = (order: OrderType) =>
    typeof order.user === 'object' ? (order.user as any).email || '' : '';

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and shipments</p>
      </div>

      {/* Filters Card */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search Bar - Reduced width */}
          <div className="relative flex-1 min-w-[250px] max-w-[400px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filters */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              const v = e.target.value;
              setDateFrom(v);
              if (dateTo && v > dateTo) {
                setDateTo(v);
              }
            }}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary"
            placeholder="From Date"
          />
          
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              const v = e.target.value;
              if (dateFrom && v < dateFrom) {
                alert("'To Date' cannot be earlier than 'From Date'");
                return;
              }
              setDateTo(v);
            }}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary"
            placeholder="To Date"
          />

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-admin-primary mb-4"></div>
            <p>Loading orders...</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order: OrderType) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-900">{order._id.slice(-8)}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getCustomerName(order)}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{getCustomerEmail(order)}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{order.orderItems?.length || 0}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        ${Number(order.totalPrice || order.itemsPrice || 0).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="View details"
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEdit(order)}
                          title="Edit status"
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <TruckIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteOrderId(order._id)}
                          title="Delete order"
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>

                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleShipQuick(order._id)}
                            disabled={actionLoading}
                            className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                          >
                            Ship
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No orders found</p>
              <p className="text-sm mt-2">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </Card>
      )}

      {/* VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{selectedOrder._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{getCustomerName(selectedOrder)}</span>
                </div>
                {getCustomerEmail(selectedOrder) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm">{getCustomerEmail(selectedOrder)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                {selectedOrder.shipmentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipment ID:</span>
                    <span className="font-medium">{selectedOrder.shipmentId}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price:</span>
                  <span className="font-medium">${Number(selectedOrder.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${Number(selectedOrder.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${Number(selectedOrder.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-semibold">Total:</span>
                  <span className="font-bold text-lg">
                    ${Number(selectedOrder.totalPrice || selectedOrder.itemsPrice || 0).toFixed(2)}
                  </span>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
                <div className="text-sm space-y-1">
                  {selectedOrder.shippingAddress.fullName && (
                    <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  )}
                  {selectedOrder.shippingAddress.addressLine1 && <p>{selectedOrder.shippingAddress.addressLine1}</p>}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode || selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            )}

            {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((it, idx) => (
                    <div key={it._id || idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {it.name || (it.product && typeof it.product === 'object' ? (it.product as any).name : '')}
                        </div>
                        <div className="text-sm text-gray-500">Quantity: {it.quantity}</div>
                      </div>
                      <div className="font-medium text-lg">${Number(it.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditOrder(selectedOrder);
                  setNewStatus(selectedOrder.status || 'pending');
                  setShipmentId(selectedOrder.shipmentId || '');
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Edit Order Status</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-admin-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {(newStatus === 'shipped' || newStatus === 'delivered') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Shipment Tracking ID</label>
                  <input
                    type="text"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    placeholder="Enter tracking number"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditOrder(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOrderId(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;