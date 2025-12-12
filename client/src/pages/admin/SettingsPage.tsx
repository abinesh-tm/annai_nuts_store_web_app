import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMe, updateProfile } from "../../store/features/auth/authSlice";
import { toast } from "react-toastify";

const AdminSettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Load user
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Fill form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        company: user.company || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  // Handle normal inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle address inputs
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSave = () => {
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => toast.success("Profile updated successfully"))
      .catch((err) => toast.error(err));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* FIRST NAME */}
          <div>
            <label className="text-gray-600">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-gray-600">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-gray-600">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* COMPANY */}
          <div>
            <label className="text-gray-600">Company</label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* STREET */}
          <div>
            <label className="text-gray-600">Street</label>
            <input
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-gray-600">City</label>
            <input
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* STATE */}
          <div>
            <label className="text-gray-600">State</label>
            <input
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* PINCODE (renamed) */}
          <div>
            <label className="text-gray-600">Pincode</label>
            <input
              name="zipCode"
              value={formData.address.zipCode}
              onChange={handleAddressChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-gray-600">Country</label>
            <input
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* EMAIL READONLY */}
          <div>
            <label className="text-gray-600">Email</label>
            <input
              disabled
              value={user?.email || ""}
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          {/* ROLE READONLY */}
          <div>
            <label className="text-gray-600">Role</label>
            <input
              disabled
              value={user?.role || ""}
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;




