import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchCustomers } from "../../store/features/customers/customersSlice";

import { Table, TableRow, TableCell } from "../../components/common/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";

const CustomersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, isLoading } = useAppSelector((state) => state.customers);

  const [searchTerm, setSearchTerm] = useState("");

  // =============== VIEW POPUP STATES ===============
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const openViewPopup = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCustomers(searchTerm));
  }, [dispatch, searchTerm]);

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">
          View and manage customer information
        </p>
      </div>

      {/* SEARCH + FILTER BAR */}
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

      {/* CUSTOMER TABLE */}
      {isLoading ? (
        <div className="text-center py-12">Loading customers...</div>
      ) : (
        <Card className="overflow-hidden">
          <Table
            headers={[
              "Customer",
              "Contact",
              "Total Orders",
              "Total Spent",
              "Status",
              "Joined",
              "Actions",
            ]}
          >
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                {/* CUSTOMER NAME + AVATAR */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} />
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                  </div>
                </TableCell>

                {/* CONTACT */}
                <TableCell>
                  <div>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    )}
                  </div>
                </TableCell>

                {/* TOTAL ORDERS */}
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {customer.totalOrders || 0}
                  </span>
                </TableCell>

                {/* TOTAL SPENT */}
                <TableCell>
                  <span className="text-sm font-medium text-green-600">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </span>
                </TableCell>

                {/* ACTIVE BADGE */}
                <TableCell>
                  <Badge variant="info">active</Badge>
                </TableCell>

                {/* JOINED DATE */}
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>

                {/* ACTION - VIEW BUTTON */}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewPopup(customer)}
                  >
                    <EyeIcon className="w-4 h-4 inline mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      )}

      {/* ================= VIEW POPUP ================= */}
      {isViewOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

            <div className="space-y-3 text-gray-800">
              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>

              {selectedCustomer.phone && (
                <p>
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </p>
              )}

              {selectedCustomer.address && (
                <div>
                  <strong>Address:</strong>
                  <p>{selectedCustomer.address.street}</p>
                  <p>
                    {selectedCustomer.address.city},{" "}
                    {selectedCustomer.address.state}
                  </p>
                  <p>
                    {selectedCustomer.address.zipCode},{" "}
                    {selectedCustomer.address.country}
                  </p>
                </div>
              )}

              <p>
                <strong>Total Orders:</strong>{" "}
                {selectedCustomer.totalOrders || 0}
              </p>

              <p>
                <strong>Total Spent:</strong> $
                {(selectedCustomer.totalSpent || 0).toFixed(2)}
              </p>

              <p>
                <strong>Joined On:</strong>{" "}
                {new Date(selectedCustomer.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <div className="flex justify-end mt-5">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

