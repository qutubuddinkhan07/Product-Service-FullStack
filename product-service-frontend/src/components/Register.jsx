import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "./axiosInstance";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP dialog state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const getErrorMessage = (err, fallback) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.payload ||
      err.response?.data;

    return typeof message === "string" ? message : fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Backend:
      // POST /api/v2/user/register
      //
      // AddUserDto expects "name", not "username".
      await axiosInstance.post("/api/v2/user/register", {
        name: form.username,
        email: form.email,
        password: form.password,
      });

      setShowOtpModal(true);
    } catch (err) {
      console.error("Registration failed:", err);

      setErrors({
        api: getErrorMessage(err, "Registration failed. Please try again."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      // Backend:
      // POST /api/v2/user/verification
      await axiosInstance.post("/api/v2/user/verification", {
        email: form.email,
        otp: otp.trim(),
      });

      setShowOtpModal(false);

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("OTP verification failed:", err);

      setOtpError(getErrorMessage(err, "Invalid or expired OTP."));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 w-full max-w-sm shadow-sm">
        {/* Logo */}
        <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center mb-6">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">
          Create your account
        </h1>

        <p className="text-sm text-neutral-400 mb-8">Sign up to get started</p>

        {/* API Error */}
        {errors.api && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              autoComplete="username"
              className={`w-full px-3 py-2.5 text-sm bg-neutral-50 border rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:bg-white transition-colors ${
                errors.username
                  ? "border-red-400 focus:border-red-500"
                  : "border-neutral-200 focus:border-neutral-900"
              }`}
            />

            {errors.username && (
              <p className="text-red-500 text-xs mt-1.5">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              className={`w-full px-3 py-2.5 text-sm bg-neutral-50 border rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:bg-white transition-colors ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-neutral-200 focus:border-neutral-900"
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                className={`w-full px-3 py-2.5 pr-14 text-sm bg-neutral-50 border rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:bg-white transition-colors ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-neutral-200 focus:border-neutral-900"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">
              Confirm password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={`w-full px-3 py-2.5 text-sm bg-neutral-50 border rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:bg-white transition-colors ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-neutral-200 focus:border-neutral-900"
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Sending code...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-neutral-400 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-900 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* OTP Dialog */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
            <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-neutral-900 mb-1">
              Verify your email
            </h2>

            <p className="text-sm text-neutral-400 mb-6">
              Enter the code we sent to{" "}
              <span className="text-neutral-700 font-medium">{form.email}</span>
              . It's valid for 3 minutes.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);

                    if (otpError) {
                      setOtpError("");
                    }
                  }}
                  maxLength={6}
                  placeholder="······"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  className={`w-full px-4 py-3 text-center text-xl tracking-widest font-mono bg-neutral-50 border rounded-lg outline-none text-neutral-900 placeholder-neutral-300 focus:bg-white transition-colors ${
                    otpError
                      ? "border-red-400 focus:border-red-500"
                      : "border-neutral-200 focus:border-neutral-900"
                  }`}
                />

                {otpError && (
                  <p className="text-red-500 text-xs mt-1.5 text-center">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify & create account"}
              </button>

              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full text-sm text-neutral-400 hover:text-neutral-700 transition-colors py-1"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
