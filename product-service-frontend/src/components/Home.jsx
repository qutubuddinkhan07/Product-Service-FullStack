import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 w-full max-w-sm shadow-sm text-center">
        {/* Logo */}
        <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Welcome</h1>
        <p className="text-sm text-neutral-400 mb-8">
          Sign in to your account or create a new one
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="block w-full py-2.5 bg-white border border-neutral-200 text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
