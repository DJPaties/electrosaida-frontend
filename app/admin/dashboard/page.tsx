import React from 'react';
import AdminLayout from '../../../components/AdminLayout';

const DashboardOverview: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded shadow">Total Users</div>
        <div className="p-6 bg-white rounded shadow">Total Orders</div>
        <div className="p-6 bg-white rounded shadow">Total Revenue</div>
      </div>
    </AdminLayout>
  );
};

export default DashboardOverview;
