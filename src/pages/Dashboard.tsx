import React from 'react';
import { useAuth } from '../contexts/auth.context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">-</p>
            <p className="text-sm text-gray-600">Total registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">-</p>
            <p className="text-sm text-gray-600">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">Online</p>
            <p className="text-sm text-gray-600">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-lg font-semibold">Users</div>
              <div className="text-sm text-gray-600">Manage users</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-lg font-semibold">Roles</div>
              <div className="text-sm text-gray-600">Manage roles</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-lg font-semibold">Settings</div>
              <div className="text-sm text-gray-600">System settings</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-lg font-semibold">Reports</div>
              <div className="text-sm text-gray-600">View reports</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}