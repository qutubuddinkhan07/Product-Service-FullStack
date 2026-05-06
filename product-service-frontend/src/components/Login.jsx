import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetch_details = async () => {
    // const result = await axios.post(
    //   `http://localhost:8080/api/v3/auth/login?username=${form.username}&password=${form.password}`,
    // );

    // ngrok url
    // const url =
    //   "https://bb2e-2401-4900-8fd2-f1a8-2ddd-c976-5ab7-94c.ngrok-free.app";

    // localhost URL
    const url = "http://localhost:8080";

    const result = await axios.post(`${url}/api/v3/auth/login`, {
      username: form.username,
      password: form.password,
    });
    const { data } = result;
    console.log(data.payload);
    localStorage.setItem("jwt_token", JSON.stringify(data.payload));
    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", form);
    // Add your auth logic here
    fetch_details();
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
          Welcome back
        </h1>
        <p className="text-sm text-neutral-400 mb-8">Sign in to your account</p>

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
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="w-full px-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white transition-colors"
            />
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
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 pr-14 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <a
                href="#"
                className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-neutral-100" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-100" />
        </div>

        {/* Google */}
        <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-neutral-400 mt-5">
          Don't have an account?{" "}
          <a href="#" className="text-neutral-900 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
