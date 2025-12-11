import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, EyeIcon, TruckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders } from '../../store/features/orders/ordersSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

/* ------------------ TYPES ------------------ */
type OrderItem = {
  _id?: string;
  name?: string;
  quantity: number;
  price: number;
  image?: string;
  product?: any;
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
  status: string;
  shipmentId?: string;
  createdAt: string;
  updatedAt?: string;
};

/* ============================================================
   STATUS TRANSITION RULES
============================================================ */
const getAllowedStatuses = (current: string) => {
  switch (current) {
    case "pending":
      return ["pending", "processing", "shipped", "delivered", "cancelled"];

    case "processing":
      return ["processing", "shipped", "delivered", "cancelled"];

    case "shipped":
      return ["shipped", "delivered"]; // Only deliver allowed

    case "delivered":
    case "cancelled":
      return []; // NO CHANGES allowed

    default:
      return ["pending", "processing", "shipped", "delivered", "cancelled"];
  }
};

/* ============================================================
   COLOR BADGES
============================================================ */
const getStatusBadge = (status: string) => {
  const colors: any = {
    pending: "warning",
    processing: "info",
    shipped: "secondary",
    delivered: "success",
    cancelled: "default",
  };
  return <Badge variant={colors[status] || "default"}>{status}</Badge>;
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.orders);

  /* Filters */
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  /* Modals and Inputs */
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [editOrder, setEditOrder] = useState<OrderType | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [shipmentId, setShipmentId] = useState<string>('');
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  /* Fetch all orders */
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  /* ============================================================
     FILTERED ORDERS
  ============================================================ */
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (orders || []).filter((order: OrderType) => {
      const oid = order._id.toLowerCase();
      const uname = typeof order.user === 'object'
        ? (order.user?.name || '').toLowerCase()
        : '';

      const bySearch = oid.includes(term) || uname.includes(term);
      const byStatus = statusFilter === 'All' ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      const date = new Date(order.createdAt);
      const fromOk = dateFrom ? date >= new Date(dateFrom) : true;
      const toOk = dateTo ? date <= new Date(dateTo) : true;

      return bySearch && byStatus && fromOk && toOk;
    });
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo]);

  /* ============================================================
     QUICK SHIP
  ============================================================ */
  const handleShipQuick = async (orderId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "shipped" }),
      });

      if (!res.ok) throw new Error("Unable to update status");

      toast.success("Order marked as shipped");
      dispatch(fetchOrders());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */
  const openEdit = (order: OrderType) => {
    setEditOrder(order);
    setNewStatus(order.status);
    setShipmentId(order.shipmentId || "");
  };

  /* ============================================================
     SAVE STATUS
  ============================================================ */
  const handleSaveStatus = async () => {
    if (!editOrder) return;

    const allowed = getAllowedStatuses(editOrder.status);
    if (!allowed.includes(newStatus)) {
      toast.error("Invalid status transition");
      return;
    }

    // Require shipment ID for shipped/delivered
   if (newStatus === "shipped" && !shipmentId.trim()) {
  toast.error("Shipment Tracking ID is required to mark as shipped");
  setActionLoading(false);
  return;
}

    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${editOrder._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          status: newStatus,
          shipmentId: ["shipped", "delivered"].includes(newStatus) ? shipmentId : undefined,
        })
      });

      if (!res.ok) throw new Error("Failed to update order");

      toast.success("Order updated");
      dispatch(fetchOrders());
      setEditOrder(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ============================================================
     DELETE ORDER
  ============================================================ */
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${deleteOrderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Order deleted");
      setDeleteOrderId(null);
      dispatch(fetchOrders());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ============================================================
     HELPERS
  ============================================================ */
  const getCustomerName = (o: OrderType) =>
    typeof o.user === "object" ? o.user?.name || "Customer" : "Customer";

  const getCustomerEmail = (o: OrderType) =>
    typeof o.user === "object" ? o.user?.email || "" : "";

  /* ============================================================
     UI START
  ============================================================ */

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and shipments</p>
      </div>

      {/* FILTER BAR */}
      <Card className="p-4 mb-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">

          {/* Search */}
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-full"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* From date */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-full"
          />

          {/* To date */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-full"
          />

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
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
      {/* ORDERS TABLE */}
      {isLoading ? (
        <Card className="p-12">
          <div className="text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-admin-primary mb-4"></div>
            <p>Loading orders...</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Items</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order: OrderType) => {
                  const locked = getAllowedStatuses(order.status).length === 0;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <span className="text-xs font-medium text-gray-900">{order._id.slice(-8)}</span>
                      </td>

                      <td className="px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getCustomerName(order)}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{getCustomerEmail(order)}</p>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                        </span>
                      </td>

                      <td className="px-3 py-2">
                        <span className="text-sm text-gray-600">{order.orderItems?.length || 0}</span>
                      </td>

                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-gray-900">
                          ${Number(order.totalPrice || order.itemsPrice || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-3 py-2">{getStatusBadge(order.status)}</td>

                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View details"
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEdit(order)}
                            title={locked ? "Cannot edit delivered/cancelled order" : "Edit status"}
                            disabled={locked}
                            className={`p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ${
                              locked ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
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

                          {/* {order.status === 'processing' && (
                            <button
                              onClick={() => handleShipQuick(order._id)}
                              disabled={actionLoading}
                              className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                            >
                              Ship
                            </button>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

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
                  <span className="font-medium">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span>{getStatusBadge(selectedOrder.status)}</span>
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
                  <span className="font-bold text-lg">${Number(selectedOrder.totalPrice || selectedOrder.itemsPrice || 0).toFixed(2)}</span>
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
                  {selectedOrder.shippingAddress.fullName && <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>}
                  {selectedOrder.shippingAddress.addressLine1 && <p>{selectedOrder.shippingAddress.addressLine1}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode || selectedOrder.shippingAddress.zipCode}</p>
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
                        <div className="font-medium">{it.name || (it.product && typeof it.product === 'object' ? it.product.name : '')}</div>
                        <div className="text-sm text-gray-500">Quantity: {it.quantity}</div>
                      </div>
                      <div className="font-medium text-lg">${Number(it.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">Close</button>
              <button
                onClick={() => {
                  setEditOrder(selectedOrder);
                  setNewStatus(selectedOrder.status);
                  setShipmentId(selectedOrder.shipmentId || '');
                  setSelectedOrder(null);
                }}
                disabled={getAllowedStatuses(selectedOrder.status).length === 0}
                className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${getAllowedStatuses(selectedOrder.status).length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
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
            <h2 className="text-2xl font-bold mb-4">Edit Order Status</h2>

            <div className="space-y-4">
              {/* If no allowed statuses, show locked message */}
              {getAllowedStatuses(editOrder.status).length === 0 ? (
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-sm text-gray-600">This order is {editOrder.status} and cannot be modified.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    >
                      {getAllowedStatuses(editOrder.status).map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shipment ID required for shipped/delivered */}
                  {newStatus === "shipped" && (
  <div>
    <label className="block text-sm font-medium mb-2">Shipment Tracking ID</label>
    <input
      type="text"
      value={shipmentId}
      onChange={(e) => setShipmentId(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-admin-primary"
      placeholder="Enter tracking number"
      required
    />
  </div>
)}
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditOrder(null)} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
              <button
                onClick={handleSaveStatus}
                disabled={actionLoading || getAllowedStatuses(editOrder.status).length === 0}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-600 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>

            <div className="flex gap-3">
              <button onClick={() => setDeleteOrderId(null)} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
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
