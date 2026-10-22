import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Badge from '../ui/Badge.jsx';
import { LogOut, Shield, LayoutDashboard, ChevronDown } from 'lucide-react';

export const UserMenu = () => {
  const { user, role, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-gray-200 bg-white hover:border-gray-300 transition-colors focus:ring-2 focus:ring-forest-800/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold text-charcoal-900 leading-tight">
            {user.name || 'User'}
          </div>
          <div className="text-[10px] text-charcoal-500 capitalize">{role}</div>
        </div>

        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User avatar'}
            className="w-8 h-8 rounded-full object-cover border border-forest-100"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-semibold text-xs flex items-center justify-center">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-charcoal-900 truncate">{user.name}</p>
            <p className="text-xs text-charcoal-500 truncate mt-0.5">{user.email}</p>
            <div className="mt-2">
              <Badge variant={isAdmin ? 'primary' : 'default'} size="sm">
                Role: {role}
              </Badge>
            </div>
          </div>

          <div className="py-1">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                >
                  <Shield className="w-4 h-4 text-forest-700" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-charcoal-500" />
                  <span>Client View</span>
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-forest-700" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="pt-1 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
