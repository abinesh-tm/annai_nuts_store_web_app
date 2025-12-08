import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCustomers } from '../../store/features/customers/customersSlice';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';

const CustomersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, isLoading } = useAppSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers(searchTerm));
  }, [dispatch, searchTerm]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">View and manage customer information</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
        <div className="text-center py-12">Loading customers...</div>
      ) : (
        <Card className="overflow-hidden">
          <Table headers={['Customer', 'Contact', 'Total Orders', 'Total Spent', 'Status', 'Joined', 'Actions']}>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} />
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{customer.totalOrders || 0}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-green-600">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="info">active</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <EyeIcon className="w-4 h-4 inline mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
};

export default CustomersPage;

