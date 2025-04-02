import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Lock, 
  Bell, 
  Camera,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  Receipt
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const { expenses } = useExpenseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    preferredDestinations: '',
    travelStyle: '',
    language: '',
    currency: '',
    notifications: {
      tripUpdates: true,
      messages: true,
      expenses: true,
      location: true
    }
  });

  useEffect(() => {
    if (authUser) {
      setProfileData({
        username: authUser.username || '',
        email: authUser.email || '',
        bio: authUser.bio || '',
        preferredDestinations: authUser.preferredDestinations || '',
        travelStyle: authUser.travelStyle || '',
        language: authUser.language || 'English',
        currency: authUser.currency || 'USD',
        notifications: authUser.notifications || {
          tripUpdates: true,
          messages: true,
          expenses: true,
          location: true
        }
      });
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{profileData.username}</h1>
                  {authUser?.isEmailVerified ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-error" />
                  )}
                </div>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-ghost"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="input input-bordered w-full"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={profileData.email}
                      className="input input-bordered w-full"
                      disabled
                    />
                    {!authUser?.isEmailVerified && (
                      <button className="btn btn-primary">Verify Email</button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="textarea textarea-bordered w-full"
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">Travel Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Preferred Destinations</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.preferredDestinations}
                    onChange={(e) => setProfileData({ ...profileData, preferredDestinations: e.target.value })}
                    className="input input-bordered w-full"
                    disabled={!isEditing}
                    placeholder="e.g., Europe, Asia, Americas"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Travel Style</span>
                  </label>
                  <select
                    value={profileData.travelStyle}
                    onChange={(e) => setProfileData({ ...profileData, travelStyle: e.target.value })}
                    className="select select-bordered w-full"
                    disabled={!isEditing}
                  >
                    <option value="">Select travel style</option>
                    <option value="budget">Budget</option>
                    <option value="comfort">Comfort</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className="select select-bordered w-full"
                      disabled={!isEditing}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Currency</span>
                    </label>
                    <select
                      value={profileData.currency}
                      onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                      className="select select-bordered w-full"
                      disabled={!isEditing}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>Trip Updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.notifications.tripUpdates}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, tripUpdates: e.target.checked }
                    })}
                    className="toggle toggle-primary"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>Messages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.notifications.messages}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, messages: e.target.checked }
                    })}
                    className="toggle toggle-primary"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    <span>Expenses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.notifications.expenses}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, expenses: e.target.checked }
                    })}
                    className="toggle toggle-primary"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Location Updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.notifications.location}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, location: e.target.checked }
                    })}
                    className="toggle toggle-primary"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Stats */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">Travel Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Total Trips</div>
                  <div className="stat-value">12</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Countries</div>
                  <div className="stat-value">8</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Total Expenses</div>
                  <div className="stat-value">${totalExpenses.toFixed(2)}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Travel Days</div>
                  <div className="stat-value">45</div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
