import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import SEO from '../components/SEO';

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
        canonical="/404"
      />

      <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-[#F59E0B] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
            404
          </h1>
          <h2 className="text-4xl font-bold text-[#111827] mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-[#6B7280] mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-white text-[#111827] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
