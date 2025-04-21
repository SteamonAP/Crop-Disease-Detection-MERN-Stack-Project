import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserCircleIcon } from '@heroicons/react/24/solid';


const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="CropCare Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-[#2C5324]">CropCare</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/detector" className="text-gray-600 hover:text-gray-900">
              Disease Detector
            </Link>
            <Link to="/crop-knowledge" className="text-gray-600 hover:text-gray-900">
              Crop Knowledge
            </Link>
            {authUser && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <Link to="/settings" className="text-gray-600 hover:text-gray-900">
                  Settings
                </Link>
              </>
            )}
          </div>

          {/* User Icon */}
          <div className="flex items-center">
            {authUser ? (
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
            <UserCircleIcon className="h-8 w-8 ml-4 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
