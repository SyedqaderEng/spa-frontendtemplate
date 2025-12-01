'use client';

import { BaseLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <BaseLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
              </h1>
              <p className="mt-2 text-gray-600">
                Here&apos;s an overview of your account.
              </p>
            </div>

            {/* Dashboard Content Placeholder */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Plan Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                <p className="mt-2 text-3xl font-bold text-blue-600">Free</p>
                <p className="mt-1 text-sm text-gray-500">
                  Upgrade to unlock more features
                </p>
                <button
                  className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>

              {/* Security Status Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Security Status</h2>
                <div className="mt-2 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-green-600 font-medium">All systems secure</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Last scan: Today at 10:30 AM
                </p>
              </div>

              {/* Quick Actions Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="mt-4 space-y-2">
                  <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View Reports
                  </button>
                  <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Manage Users
                  </button>
                  <button
                    onClick={logout}
                    className="w-full rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <div className="mt-4 text-center text-gray-500 py-8">
                <p>No recent activity to display.</p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  );
}
