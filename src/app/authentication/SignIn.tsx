"use client";
import { IUser } from "@/app/types/IUser";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Test() {
  const [user, setUser] = useState<IUser>({ username: "", password: "" });
  const [errorResponse , setErrorResponse] = useState<string>("")
  const router = useRouter();

  function handleUserChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const createUrlEncodedBody = (user: IUser): URLSearchParams => {
      return new URLSearchParams({
        username: user.username,
        password: user.password,
      });
    };

    const timeout: number = 10_000;
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      fetch("https://localhost:8443/api/v1/auth/login", {
        method: "POST",
        body: createUrlEncodedBody(user),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        signal,
      })
        .then(async (response) => {
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return (await response.json()) as {
            accessToken: string;
            refreshToken: string;
          };
        })
        .then((data) => {
          const { accessToken, refreshToken } = data;

          localStorage.setItem("accsessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          console.log("Login successful:", data);
          router.push("/dashboard");
        })
        .catch((error) => {
          console.log(error);

          clearTimeout(timeoutId);
          if (error.name === "AbortError") {
            console.error("Error: Request timed out");
          } else {
            console.error("Error:", error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="bg-slate-950 bg-gradient-to-t from-blue-100 h-screen">
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form
            onSubmit={onSubmit}
            className="w-full max-w-sm mx-auto p-8 rounded-md shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                focus:border-indigo-500
                text-black"
                placeholder="username.."
                type="text"
                name="username"
                onChange={(event) => handleUserChange(event)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                focus:border-indigo-500
                text-black"
                placeholder="password.."
                type="password"
                name="password"
                onChange={(event) => handleUserChange(event)}
              />
            </div>

            <button
              className="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
        <p>DEBUGGING: {user.username}</p>
        <p>DEBUGGING: {user.password}</p>
      </div>
    </>
  );
}
