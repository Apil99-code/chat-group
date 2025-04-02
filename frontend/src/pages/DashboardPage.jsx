import { useState, useEffect } from 'react';
import { useGroupStore } from '../store/useGroupStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  MapPin, 
  Users, 
  Receipt, 
  MessageSquare, 
  Calendar, 
  ChevronRight,
  Plane,
  Hotel,
  Utensils,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { groups, getGroups } = useGroupStore();
  const { expenses, getExpenses } = useExpenseStore();
  const { authUser } = useAuthStore();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    getGroups();
    getExpenses();
  }, [getGroups, getExpenses]);

  useEffect(() => {
    // Mock upcoming trips data (replace with actual data from your backend)
    setUpcomingTrips([
      {
        id: 1,
        name: 'Paris Adventure',
        date: 'June 15-20, 2024',
        members: 4,
        destination: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 2,
        name: 'Tokyo Explorer',
        date: 'July 10-15, 2024',
        members: 3,
        destination: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      }
    ]);

    // Mock recent activity (replace with actual data from your backend)
    setRecentActivity([
      {
        id: 1,
        type: 'message',
        content: 'New message in Paris Group',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'expense',
        content: 'New expense added to Tokyo trip',
        time: '4 hours ago'
      },
      {
        id: 3,
        type: 'location',
        content: 'Location shared in Paris Group',
        time: '5 hours ago'
      }
    ]);
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {authUser?.username}!</h1>
          <p className="text-gray-600">Here's what's happening with your trips</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Plane className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Total Trips</h3>
                  <p className="text-2xl font-bold">{upcomingTrips.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Active Groups</h3>
                  <p className="text-2xl font-bold">{groups.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Total Expenses</h3>
                  <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Upcoming Trips</h2>
                  <Link to="/trip" className="btn btn-sm btn-ghost">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{trip.name}</h3>
                        <p className="text-sm text-gray-600">{trip.destination}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {trip.date}
                          </span>
                          <span className="text-sm flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {trip.members} members
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-primary" />}
                        {activity.type === 'expense' && <Receipt className="w-5 h-5 text-primary" />}
                        {activity.type === 'location' && <MapPin className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;