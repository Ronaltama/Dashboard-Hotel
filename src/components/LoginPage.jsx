import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Validasi sisi klien sederhana
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setIsLoading(true);
    const result = await onLogin(username, password); // Panggil fungsi login dari App.jsx
    setIsLoading(false);

    if (!result.success) {
      setError(result.message || "Login failed. Please try again.");
    }
    // Jika berhasil, App.jsx akan mengubah state isAuthenticated dan merender dashboard
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border border-blue-100 w-full max-w-md mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        iBright <span className="text-blue-500">Login</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="shadow-sm appearance-none border border-blue-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm appearance-none border border-blue-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm italic mb-4 text-center">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline shadow-md transition duration-200 ease-in-out transform hover:scale-105 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
