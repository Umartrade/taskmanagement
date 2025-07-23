import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Trophy, 
  Plus,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      current: location.pathname === '/tasks'
    },
    {
      name: 'Create Task',
      href: '/tasks/new',
      icon: Plus,
      current: location.pathname === '/tasks/new'
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      current: location.pathname === '/leaderboard'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">TaskFlow</h2>
            <p className="text-xs text-gray-500">Manage your tasks</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.current
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-1">
            Welcome, {user?.username}!
          </h3>
          <p className="text-xs text-blue-700">
            {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
          </p>
          <div className="mt-2 text-xs text-blue-600">
            <p>Tasks Created: {user?.stats.tasksCreated || 0}</p>
            <p>Tasks Completed: {user?.stats.tasksCompleted || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;