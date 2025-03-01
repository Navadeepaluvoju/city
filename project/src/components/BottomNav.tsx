import { Home, Tag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home
    },
    {
      label: 'Offers',
      path: '/offers',
      icon: Tag
    },
    {
      label: 'Profile',
      path: user ? '/profile' : '/signin',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2 my-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50 scale-110'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`h-6 w-6 ${
                isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <span className="mt-1 text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}