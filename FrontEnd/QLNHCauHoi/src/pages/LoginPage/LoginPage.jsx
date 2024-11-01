import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import authApi from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, username: value });

    if (value.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username must be at least 3 characters",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    if (value.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !errors.username &&
      !errors.password &&
      formData.username &&
      formData.password
    ) {
      setIsLoading(true);
      try {
        const params = {
          username: formData.username.trim(), // Trim whitespace
          password: formData.password.trim(), // Trim whitespace
        };

        // Call the login API
        const response = await authApi.login(params);
        const { token } = response; // Assuming the API returns token and userData

        if (token) {
          // Save both token and user data
          localStorage.setItem("token", JSON.stringify(token));
          navigate("/danhsach");
        } else {
          setErrors({
            ...errors,
            username:
              "Invalid credentials. Please check your username and password.",
          });
          setFormData({ ...formData, password: "" }); // Clear password field
          // Reload the page on login failure
        }
      } catch (error) {
        console.error("Error during login:", error);

        // Inspect the error response from the API
        if (error.response) {
          setErrors({
            ...errors,
            username:
              error.response.data.message || "Login failed. Please try again.",
          });
        } else {
          setErrors({
            ...errors,
            username: "Login failed. Please try again.",
          });
        }
        setFormData({ ...formData, password: "" }); // Clear password field
        // Reload the page on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleUsernameChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your username"
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby="username-error"
              autoComplete="username"
            />
            {errors.username && (
              <p
                id="username-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.username}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || errors.username || errors.password}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 h-11"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
