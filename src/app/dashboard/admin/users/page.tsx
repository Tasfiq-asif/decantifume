/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loading } from "@/components/ui/loading";
import {
  Search,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  User as UserIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  setUsersPage,
} from "@/redux/slices/adminSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { AdminUser } from "@/redux/slices/adminSlice";

const AdminUsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, usersLoading, usersError, usersPagination } = useSelector(
    (state: RootState) => state.admin
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  // Fetch users with current filters
  const fetchUsers = useCallback(() => {
    const params: any = {
      page: usersPagination.page,
      limit: usersPagination.limit,
      sortBy,
      sortOrder,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedRole) params.role = selectedRole;
    if (selectedStatus !== "") params.isActive = selectedStatus === "active";

    dispatch(fetchAllUsers(params));
  }, [dispatch, usersPagination.page, usersPagination.limit, sortBy, sortOrder, searchTerm, selectedRole, selectedStatus]);

  // Initial data fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      dispatch(setUsersPage(1));
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayedFetch);
  }, [searchTerm, selectedRole, selectedStatus, sortBy, sortOrder, dispatch, fetchUsers]);

  // Fetch when page changes (eslint-disable to avoid re-running on filter changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
  }, [usersPagination.page]);

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await dispatch(updateUserStatus({ userId, isActive })).unwrap();
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleRoleUpdate = async (userId: string, role: "user" | "admin") => {
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await dispatch(deleteUser(userToDelete._id)).unwrap();
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (usersLoading) {
    return <Loading fullscreen message="Loading users..." />;
  }

  if (usersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
          <p className="text-white text-lg mb-4">Error loading users</p>
          <p className="text-lavender-200 mb-4">{usersError}</p>
          <button
            onClick={fetchUsers}
            className="bg-lavender-600 hover:bg-lavender-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-lavender-200">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg text-white placeholder-lavender-300 focus:outline-none focus:ring-2 focus:ring-lavender-500"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none"
              >
                <option value="" className="bg-dark-purple-800">
                  All Roles
                </option>
                <option value="user" className="bg-dark-purple-800">
                  User
                </option>
                <option value="admin" className="bg-dark-purple-800">
                  Admin
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none"
              >
                <option value="" className="bg-dark-purple-800">
                  All Status
                </option>
                <option value="active" className="bg-dark-purple-800">
                  Active
                </option>
                <option value="inactive" className="bg-dark-purple-800">
                  Inactive
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none"
              >
                <option value="createdAt" className="bg-dark-purple-800">
                  Date Created
                </option>
                <option value="name" className="bg-dark-purple-800">
                  Name
                </option>
                <option value="email" className="bg-dark-purple-800">
                  Email
                </option>
                <option value="role" className="bg-dark-purple-800">
                  Role
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-2 bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none"
              >
                <option value="desc" className="bg-dark-purple-800">
                  Newest First
                </option>
                <option value="asc" className="bg-dark-purple-800">
                  Oldest First
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-purple-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-lavender-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-lavender-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-lavender-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-lavender-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-lavender-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-lavender-600 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-lavender-300">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleUpdate(
                              user._id,
                              e.target.value as "user" | "admin"
                            )
                          }
                          className="bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none pr-8"
                        >
                          <option value="user" className="bg-dark-purple-800">
                            User
                          </option>
                          <option value="admin" className="bg-dark-purple-800">
                            Admin
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lavender-300 h-3 w-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={user.isActive ? "active" : "inactive"}
                          onChange={(e) =>
                            handleStatusUpdate(
                              user._id,
                              e.target.value === "active"
                            )
                          }
                          className="bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 appearance-none pr-8"
                        >
                          <option value="active" className="bg-dark-purple-800">
                            Active
                          </option>
                          <option
                            value="inactive"
                            className="bg-dark-purple-800"
                          >
                            Inactive
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lavender-300 h-3 w-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-lavender-200">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 bg-lavender-600/20 hover:bg-lavender-600/30 text-lavender-300 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-dark-purple-800/30 px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-lavender-200">
                Showing {(usersPagination.page - 1) * usersPagination.limit + 1}{" "}
                to{" "}
                {Math.min(
                  usersPagination.page * usersPagination.limit,
                  usersPagination.total
                )}{" "}
                of {usersPagination.total} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    dispatch(setUsersPage(usersPagination.page - 1))
                  }
                  disabled={usersPagination.page <= 1}
                  className="p-2 bg-lavender-600/20 hover:bg-lavender-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-lavender-300 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-white">
                  Page {usersPagination.page} of {usersPagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    dispatch(setUsersPage(usersPagination.page + 1))
                  }
                  disabled={usersPagination.page >= usersPagination.totalPages}
                  className="p-2 bg-lavender-600/20 hover:bg-lavender-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-lavender-300 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-purple-800 border border-white/20 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-lavender-300 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Name
                      </label>
                      <p className="text-white font-medium">
                        {selectedUser.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Email
                      </label>
                      <p className="text-white font-medium">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Role
                      </label>
                      <div className="flex items-center space-x-2">
                        {selectedUser.role === "admin" ? (
                          <Shield className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-lavender-300" />
                        )}
                        <span className="text-white font-medium capitalize">
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Status
                      </label>
                      <div className="flex items-center space-x-2">
                        {selectedUser.isActive ? (
                          <UserCheck className="h-4 w-4 text-green-400" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white font-medium">
                          {selectedUser.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Created At
                      </label>
                      <p className="text-white font-medium">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-lavender-300 text-sm font-medium">
                        Last Updated
                      </label>
                      <p className="text-white font-medium">
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedUser._id,
                          !selectedUser.isActive
                        )
                      }
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedUser.isActive
                          ? "bg-red-600/20 hover:bg-red-600/30 text-red-300"
                          : "bg-green-600/20 hover:bg-green-600/30 text-green-300"
                      }`}
                    >
                      {selectedUser.isActive
                        ? "Deactivate User"
                        : "Activate User"}
                    </button>
                    <button
                      onClick={() =>
                        handleRoleUpdate(
                          selectedUser._id,
                          selectedUser.role === "admin" ? "user" : "admin"
                        )
                      }
                      className="px-4 py-2 bg-lavender-600/20 hover:bg-lavender-600/30 text-lavender-300 rounded-lg transition-colors"
                    >
                      {selectedUser.role === "admin"
                        ? "Remove Admin"
                        : "Make Admin"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-purple-800 border border-white/20 rounded-lg p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100/10 mb-4">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Delete User
                </h3>
                <p className="text-lavender-200 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {userToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
