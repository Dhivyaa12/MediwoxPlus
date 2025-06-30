import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const dashboardRoutes = ['/patient-dashboard', '/doctor-dashboard', '/book-appointment'];
  const isDashboard = dashboardRoutes.includes(location.pathname);

  const baseTextColor = isDashboard ? 'text-black' : 'text-white';
  const hoverEffect = 'hover:underline transform hover:scale-105 transition-transform duration-200';

  return (
    <nav className={`${isDashboard ? 'bg-blue-200' : 'bg-blue-600'} shadow-lg sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform px-2 py-1 rounded-md">
            <img
              src="/medical video/logo of mediwox.jpg"
              alt="Mediwox Logo"
              className="h-10 w-auto object-contain drop-shadow-lg"
            />
            <span
              className={`text-xl md:text-2xl font-extrabold hidden md:inline ${isDashboard ? 'text-black' : 'text-white'}`}
              style={{
                fontFamily: 'Georgia, serif',
                textShadow: isDashboard
                  ? '1px 1px 2px #fff, 2px 2px 4px #fff'
                  : '1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000',
              }}
            >
              Mediwox
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 relative">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 font-medium focus:outline-none ${baseTextColor} ${hoverEffect}`}
              >
                <span>Menu</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-40 bg-gray-800 text-white rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
                  <Link to="/" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:underline hover:scale-105 transform transition-transform">Home</Link>
                  <Link to="/about" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:underline hover:scale-105 transform transition-transform">About Us</Link>
                  <Link to="/contact" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:underline hover:scale-105 transform transition-transform">Contact Us</Link>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <>
                <Link to="/patient-login" className={`${baseTextColor} ${hoverEffect} ${isActive('/patient-login') ? 'underline' : ''}`}>Patient Login</Link>
                <Link to="/doctor-login" className={`${baseTextColor} ${hoverEffect} ${isActive('/doctor-login') ? 'underline' : ''}`}>Doctor Login</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'patient' && (
              <>
                <Link to="/patient-dashboard" className={`${baseTextColor} ${hoverEffect} ${isActive('/patient-dashboard') ? 'underline' : ''}`}>Dashboard</Link>
                <Link to="/book-appointment" className={`${baseTextColor} ${hoverEffect} ${isActive('/book-appointment') ? 'underline' : ''}`}>Book Appointment</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'doctor' && (
              <Link to="/doctor-dashboard" className={`${baseTextColor} ${hoverEffect} ${isActive('/doctor-dashboard') ? 'underline' : ''}`}>Dashboard</Link>
            )}

            <a href="tel:9840635391" className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
              <Phone className="h-4 w-4" />
              <span>Emergency</span>
            </a>

            {/* Desktop Logout Button - Always Visible if Authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all font-medium text-white hover:underline transform hover:scale-105 duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={hoverEffect}>Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className={hoverEffect}>About Us</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={hoverEffect}>Contact Us</Link>

              {!isAuthenticated && (
                <>
                  <Link to="/patient-login" onClick={() => setIsMenuOpen(false)} className={`${hoverEffect} ${isActive('/patient-login') ? 'underline' : ''}`}>Patient Login</Link>
                  <Link to="/doctor-login" onClick={() => setIsMenuOpen(false)} className={`${hoverEffect} ${isActive('/doctor-login') ? 'underline' : ''}`}>Doctor Login</Link>
                </>
              )}

              {isAuthenticated && user?.role === 'patient' && (
                <>
                  <Link to="/patient-dashboard" onClick={() => setIsMenuOpen(false)} className={`${hoverEffect} ${isActive('/patient-dashboard') ? 'underline' : ''}`}>Dashboard</Link>
                  <Link to="/book-appointment" onClick={() => setIsMenuOpen(false)} className={`${hoverEffect} ${isActive('/book-appointment') ? 'underline' : ''}`}>Book Appointment</Link>
                </>
              )}

              {isAuthenticated && user?.role === 'doctor' && (
                <Link to="/doctor-dashboard" onClick={() => setIsMenuOpen(false)} className={`${hoverEffect} ${isActive('/doctor-dashboard') ? 'underline' : ''}`}>Dashboard</Link>
              )}

              <a href="tel:9840635391" className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all w-fit">
                <Phone className="h-4 w-4" />
                <span>Emergency</span>
              </a>

              {/* Mobile Logout Button - Always Visible if Authenticated */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all w-fit hover:underline transform hover:scale-105"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;




