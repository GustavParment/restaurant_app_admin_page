"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the refresh token cookie
    document.cookie = "refreshToken=; path=/; max-age=0; secure; SameSite=Strict";

    // Optionally clear access token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect to login page
    router.push("/authentication/login");

    console.log("Logout successful");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">
      Logout
    </button>
  );
}
