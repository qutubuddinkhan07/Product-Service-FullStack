import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 w-full max-w-sm shadow-sm text-center">
        {/* Logo */}
        <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <p className="text-5xl font-semibold text-neutral-900 mb-2 tracking-tight">
          404
        </p>
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">
          Page not found
        </h1>
        <p className="text-sm text-neutral-400 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="block w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
