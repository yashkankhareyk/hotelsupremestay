import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { AdminCredentials } from '../types/admin';
import { AuthAPI } from '../api/client'; // adjust path if needed

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<AdminCredentials>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const username = credentials.username?.trim();
    const password = credentials.password;

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      // Login (sets HttpOnly JWT cookie; CSRF handled inside AuthAPI)
      await AuthAPI.login({ username, password });

      // Optional: confirm session; if it fails, continue (cookie is set)
      let me: { username?: string } | null = null;
      try {
        me = await AuthAPI.me();
      } catch {
        // ignore
      }

      // Keep compatibility with current AuthGuard (localStorage check)
      localStorage.setItem(
        'adminAuth',
        JSON.stringify({ isAuthenticated: true, username: me?.username ?? username })
      );

      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error as string | undefined;
      const msg =
        serverMsg ||
        (status === 423
          ? 'Account temporarily locked due to failed attempts. Please try again later.'
          : status === 429
          ? 'Too many attempts. Please wait and try again.'
          : status === 400 || status === 401
          ? 'Invalid username or password'
          : 'Unable to sign in. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login"
        description="Admin login page for Sunshine Hotel"
        canonical="/admin"
      />

      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B132B] mb-2">Admin Login</h1>
            <p className="text-sm sm:text-base text-gray-600">Enter your credentials to access the admin dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4" role="alert" aria-live="polite">
              <p className="text-sm sm:text-base text-red-700">{error}</p>
            </div>
          )}

          <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] focus:z-10 text-sm sm:text-base"
                  placeholder="Admin username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] focus:z-10 text-sm sm:text-base"
                  placeholder="Admin password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-[#F59E0B] hover:bg-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F59E0B] transition-colors disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}