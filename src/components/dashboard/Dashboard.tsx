import React, { useEffect } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import TaskCard from '../tasks/TaskCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, fetchTasks, fetchStats } = useTask();

  useEffect(() => {
    fetchTasks({}, 1);
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const recentTasks = tasks.slice(0, 5);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: Target,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-5%',
      changeType: 'negative'
    }
  ];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              You have {stats?.todo || 0} pending tasks and {stats?.inProgress || 0} in progress.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/tasks/new"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <Link
                  to="/tasks"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showActions={false} compact />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks yet. Create your first task!</p>
                  <Link
                    to="/tasks/new"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.stats.tasksCreated ? 
                    Math.round((user.stats.tasksCompleted / user.stats.tasksCreated) * 100) : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${user?.stats.tasksCreated ? 
                      (user.stats.tasksCompleted / user.stats.tasksCreated) * 100 : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasks Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.stats.tasksCreated || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.stats.tasksCompleted || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/tasks/new"
                className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Create New Task</span>
              </Link>
              <Link
                to="/tasks?status=in-progress"
                className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Clock className="w-5 h-5 text-yellow-600" />
                <span>View In Progress</span>
              </Link>
              <Link
                to="/leaderboard"
                className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>View Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;