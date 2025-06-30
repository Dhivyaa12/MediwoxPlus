import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig';

interface LoginProps {
  userType: 'patient' | 'doctor';
}

const Login: React.FC<LoginProps> = ({ userType }) => {
  const [signingIn, setSigningIn] = useState(false); // prevent multiple Google popups
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Success:", result.user);

      // Optionally update display name if not set
      if (formData.fullName && result.user.displayName !== formData.fullName) {
        await result.user.updateProfile({ displayName: formData.fullName });
        console.log("Updated user name to:", formData.fullName);
      }

      navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError(error.message || "Google login failed");
    } finally {
      setSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.email) {
      setError('Please enter your email');
      return;
    }

    if (userType === 'doctor') {
      if (!formData.password) {
        setError('Please enter your password');
        return;
      }

      const success = await login(formData.email, formData.password, userType, formData.fullName);
      if (success) {
        navigate('/doctor-dashboard');
      } else {
        setError('Invalid doctor credentials');
      }
    } else if (userType === 'patient') {
      const success = await login(formData.email, '', 'patient', formData.fullName);
      if (success) {
        navigate('/patient-dashboard');
      } else {
        setError('Invalid patient login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Heart className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {userType === 'patient' ? 'Patient Login' : 'Doctor Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userType === 'patient'
              ? 'Access your health records and book appointments'
              : 'Access your patient management dashboard'}
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
              />
            </div>

            {userType === 'doctor' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </button>
        </form>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={signingIn}
          className={`w-full py-2 rounded-lg font-medium text-white transition 
            ${signingIn ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-red-600'}`}
        >
          {signingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {userType === 'patient' ? 'Are you a doctor?' : 'Are you a patient?'}
            <Link
              to={userType === 'patient' ? '/doctor-login' : '/patient-login'}
              className="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              {userType === 'patient' ? 'Doctor Login' : 'Patient Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
