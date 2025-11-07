import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center">
        {/* Left Section - Image */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-700 text-white p-10 rounded-l-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-center"
          >
            <img
              src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
              alt="SmartBilling Illustration"
              className="rounded-2xl shadow-lg mb-6 w-full"
            />
            <h1 className="text-3xl font-bold mb-2">Welcome to SmartBilling</h1>
            <p className="text-blue-100">
              Manage your business effortlessly — from billing and inventory to
              dealer management — all in one simple dashboard.
            </p>
          </motion.div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl lg:rounded-l-none rounded-r-2xl p-8 w-full max-w-md"
          >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-2 mb-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-gray-600 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-600 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </motion.form>
        </div>
      </div>
    </div>
  );
}
