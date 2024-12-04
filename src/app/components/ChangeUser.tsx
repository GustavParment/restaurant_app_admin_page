"use client";
import React, { useEffect, useState } from "react";
import { IUser } from "../types/IUser";

const ChangeUser = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">All Users in Database</h1>

      {error && <p className="text-red-500">{error}</p>}

      {users.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="text-black p-3 border-b">Username</th>
              <th className="text-black p-3 border-b">Email</th>
              <th className="text-black p-3 border-b">Password</th>
              <th>
                <p className="text-black font-bold p-3 border-b">Edit</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="text-black p-3 border-b">{user.username}</td>
                <td className="text-black p-3 border-b">{user.email}</td>
                <td className="text-black p-3 border-b">{user.password}</td>
                <td>
                  <button className="bg-blue-700 py-2 px-1 rounded-sm font-bold ">
                    change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ChangeUser;
