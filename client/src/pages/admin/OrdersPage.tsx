import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchOrders, updateOrderStatus } from '../../store/features/orders/ordersSlice';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleShip = async (orderId: string) => {
    await dispatch(updateOrderStatus({ id: orderId, status: 'shipped' }));
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'info' | 'warning' | 'default' } = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order._id.toLowerCase();
    const customerName = typeof order.user === 'object' ? order.user.name.toLowerCase() : '';
    return orderId.includes(searchTerm.toLowerCase()) || customerName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and shipments</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary"
            />
          </div>
          <Button variant="outline">
            <FunnelIcon className="w-5 h-5 inline mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : (
        <Card className="overflow-hidden">
          <Table headers={['Order Number', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions']}>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <span className="font-medium">{order._id}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {typeof order.user === 'object' ? order.user.name : 'Customer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {typeof order.user === 'object' ? order.user.email : ''}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{order.orderItems.length} items</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4 inline mr-1" />
                      View
                    </Button>
                    {order.status === 'processing' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShip(order._id)}
                      >
                        <TruckIcon className="w-4 h-4 inline mr-1" />
                        Ship
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;

