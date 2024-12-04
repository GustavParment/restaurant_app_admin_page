"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import ChangeUser from "./ChangeUser";

export interface IAdmin {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
}

export default function AdminOperations() {
  const [admin, setAdmin] = useState<IAdmin>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  });

  const router = useRouter();
  const [creationError, setCreationError] = useState<string | null>(null);
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);

  function handleAdminChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAdmin((prevData) => ({ ...prevData, [name]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setCreationError(null);
    setCreationSuccess(null);

    const createJsonBody = (admin: IAdmin): string => {
      return JSON.stringify(admin);
    };

    const timeout: number = 10_000;
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      fetch("https://localhost:8443/api/v1/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: createJsonBody(admin),
        signal,
      })
        .then((response) => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Admin created successfully:", data);

          setAdmin({
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            birthday: "",
          });

          setCreationSuccess("Admin created successfully!");

          router.push("/dashboard");
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === "AbortError") {
            console.error("Error: Request timed out");
          } else {
            console.error("Error:", error);
            setCreationError("Failed to create admin. Please try again.");
          }
        });
    } catch (error: any) {
      console.error(error);
      setCreationError(error.message || "Failed to create admin.");
    }
  }

  return (
    <div className="bg-slate-950 bg-gradient-to-t from-blue-100 h-screen">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Create Admin
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm mx-auto p-6 rounded-lg shadow-md bg-white"
        >
          {/* Form fields */}
          {[
            { name: "username", type: "text", placeholder: "Username" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "firstName", type: "text", placeholder: "First Name" },
            { name: "lastName", type: "text", placeholder: "Last Name" },
            { name: "birthday", type: "date", placeholder: "Birthday" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 capitalize"
                htmlFor={field.name}
              >
                {field.name}
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                focus:border-indigo-500 text-gray-700"
                placeholder={field.placeholder}
                type={field.type}
                name={field.name}
                value={(admin as any)[field.name]}
                onChange={(event) => handleAdminChange(event)}
              />
            </div>
          ))}

          <button
            className="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
            type="submit"
          >
            Create Admin
          </button>
        </form>

        {/* Error or success messages */}
        {creationError && (
          <p className="text-red-500 text-center mt-4">{creationError}</p>
        )}
        {creationSuccess && (
          <p className="text-green-500 text-center mt-4">{creationSuccess}</p>
        )}
      </div>
      <ChangeUser />
    </div>
  );
}
