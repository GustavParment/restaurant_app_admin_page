"use client";

import { IUser } from "@/app/types/IUser";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SignIn() {
  const [user, setUser] = useState<IUser>({ username: "", password: "" });
  const [errorResponse, setErrorResponse] = useState<string>("");
  const router = useRouter();

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user.username || !user.password) {
      setErrorResponse("Username and password are required");
      return;
    }

    try {
      const createUrlEncodedBody = new URLSearchParams({
        username: user.username,
        password: user.password,
      });

      const response = await fetch("https://localhost:8443/api/v1/auth/login", {
        method: "POST",
        body: createUrlEncodedBody,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const errorText = await response.text();
          setErrorResponse(errorText || "Unauthorized");
        } else {
          setErrorResponse("An unexpected error occurred. Please try again.");
        }
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("accessToken", data.accessToken);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorResponse("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <header className="text-2xl font-bold text-center mb-4">Please Login</header>
      <section>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="border rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username..."
              type="text"
              name="username"
              value={user.username}
              onChange={handleUserChange}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="border rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password..."
              type="password"
              name="password"
              value={user.password}
              onChange={handleUserChange}
            />
          </div>

          {/* Error Message */}
          {errorResponse && (
            <div className="text-red-500 text-center text-sm">
              {errorResponse}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </section>
    </div>
  );
}
