"use client";
import React, { useEffect, useState } from "react";
import { IUser } from "../types/IUser";

const ChangeUser = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://localhost:8443/api/v1/user/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("Failed to load users. Please try again.");
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: IUser) => {
    setSelectedUser(user);
    setUpdatedUsername(user.username);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUpdatedUsername("");
    setUpdatedPassword("");
  };

  const openDeleteModal = (user: IUser) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      username: updatedUsername,
      password: updatedPassword,
    };

    try {
      const response = await fetch(
        `https://localhost:8443/api/v1/user/update/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `https://localhost:8443/api/v1/user/delete/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      // Remove the user from the state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-8 h-screen min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">
          All Users in Database
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-black p-3 border-b text-left">
                    Username
                  </th>
                  <th className="text-black p-3 border-b text-left">Email</th>
                  <th className="text-black p-3 border-b text-left">Role</th>
                  <th className="text-black font-bold p-3 border-b text-left"></th>
                  <th className="text-black font-bold p-3 border-b text-left"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="text-black p-3 border-b">{user.username}</td>
                    <td className="text-black p-3 border-b">{user.email}</td>
                    <td className="text-black p-3 border-b">{user.role}</td>
                    <td>
                      <button
                        onClick={() => openModal(user)}
                        className="bg-blue-700 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-800"
                      >
                        Change
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-700 text-white py-2 px-4 rounded-md font-bold hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No users found.</p>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-black">Edit User</h2>

              {/* Display User ID */}
              <label className="block mb-2 text-gray-700">
                User ID
                <input
                  type="text"
                  value={selectedUser?.id?.toString() || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </label>

              <label className="block mb-2 text-gray-700">
                Username
                <input
                  type="text"
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block mb-2 text-gray-700">
                Password
                <input
                  type="text"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </label>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-black">Delete User</h2>
              <p className="mb-4 text-gray-700">
                Are you sure you want to delete {selectedUser?.username}?
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeUser;
