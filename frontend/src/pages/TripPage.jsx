import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Plus, 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter,
  List,
  Grid,
  Clock,
  Plane,
  Hotel,
  Utensils,
  Trash2,
  Share2,
  Edit2,
  Receipt,
  User
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { useChatStore } from '../store/useChatStore';
import { useGroupStore } from '../store/useGroupStore';
import { toast } from 'react-hot-toast';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TripPage = () => {
  const { 
    trips, 
    selectedTrip, 
    isTripsLoading, 
    isTripSubmitting,
    showEditModal,
    showShareModal,
    getTrips, 
    createTrip, 
    updateTrip, 
    deleteTrip,
    shareTrip,
    setSelectedTrip,
    clearSelectedTrip,
    toggleEditModal,
    toggleShareModal
  } = useTripStore();

  const { currentUser } = useChatStore();
  const { groups } = useGroupStore();
  

  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTripForm, setNewTripForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    coordinates: [0, 0],
    members: 1,
    budget: 0,
    status: 'planning',
    description: '',
    image: '',
    activities: [],
    accommodation: '',
    transportation: '',
    isPublic: false
  });

  const [shareForm, setShareForm] = useState({
    sharedWith: [],
    sharedGroups: [],
    isPublic: false
  });

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getTrips();
  }, [getTrips]);

  useEffect(() => {
    if (selectedTrip) {
      setShareForm({
        sharedWith: selectedTrip.sharedWith || [],
        sharedGroups: selectedTrip.sharedGroups || [],
        isPublic: selectedTrip.isPublic || false,
      });
    }
  }, [selectedTrip]);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setMapCenter(trip.coordinates);
    setMapZoom(12);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'all' ? true : trip.status === filterStatus;
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLocationSearch = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setNewTripForm(prev => ({
          ...prev,
          coordinates: [parseFloat(lat), parseFloat(lon)]
        }));
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapZoom(12);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      toast.error('Failed to find location');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const tripData = {
        ...newTripForm,
        members: Array.isArray(newTripForm.members) ? newTripForm.members : [newTripForm.members],
      };
      await createTrip(tripData);
      setShowNewTripModal(false);
      setNewTripForm({
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        coordinates: [0, 0],
        members: 1, // Reset to default
        budget: 0,
        status: 'planning',
        description: '',
        image: '',
        activities: [],
        accommodation: '',
        transportation: '',
        isPublic: false,
      });
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      await updateTrip(selectedTrip._id, newTripForm);
      setNewTripForm({
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        coordinates: [0, 0],
        members: 1,
        budget: 0,
        status: 'planning',
        description: '',
        image: '',
        activities: [],
        accommodation: '',
        transportation: '',
        isPublic: false
      });
    } catch (error) {
      console.error('Failed to update trip:', error);
    }
  };

  const handleShareTrip = async (tripId, shareData) => {
    try {
      await shareTrip(tripId, shareData);
    } catch (error) {
      console.error("Failed to share trip:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-gray-600">Plan and manage your adventures</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn btn-ghost btn-sm"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowNewTripModal(true)}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search trips..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <select 
            className="select select-bordered w-full md:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-base-100 rounded-box p-4">
              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {isTripsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : filteredTrips.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No trips found
                  </div>
                ) : (
                  filteredTrips.map((trip) => (
                    <div
                      key={trip._id}
                    onClick={() => handleTripSelect(trip)}
                    className={`card bg-base-100 shadow hover:shadow-lg cursor-pointer transition-all duration-300 ${
                        selectedTrip?._id === trip._id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="card-body p-4">
                      <div className="flex gap-4">
                        <img
                            src={trip.image || 'https://via.placeholder.com/150'}
                          alt={trip.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{trip.title}</h3>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTrip(trip);
                                    toggleShareModal(true);
                                  }}
                                  className="btn btn-ghost btn-sm"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTrip(trip);
                                    setNewTripForm(trip);
                                    toggleEditModal(true);
                                  }}
                                  className="btn btn-ghost btn-sm"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTrip(trip._id);
                                  }}
                                  className="btn btn-ghost btn-sm text-error"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {trip.location}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(trip.startDate), 'MMM d')} -{' '}
                              {format(new Date(trip.endDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Map and Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0" style={{ height: '400px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {trips.map((trip) => (
                    <Marker
                      key={trip._id}
                      position={trip.coordinates}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold">{trip.title}</h3>
                          <p className="text-sm">{trip.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Trip Details Card */}
            {selectedTrip && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title text-2xl">{selectedTrip.title}</h2>
                      <p className="text-gray-600">{selectedTrip.description}</p>
                    </div>
                    <span className={`badge ${getStatusColor(selectedTrip.status)}`}>
                      {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Trip Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Duration</div>
                      <div className="stat-value text-lg">
                        {format(new Date(selectedTrip.startDate), 'MMM d')} -{' '}
                        {format(new Date(selectedTrip.endDate), 'MMM d')}
                      </div>
                    </div>
                    
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <Users className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Members</div>
                      <div className="stat-value text-lg">{selectedTrip.members} people</div>
                    </div>
                    
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Location</div>
                      <div className="stat-value text-lg">{selectedTrip.location}</div>
                    </div>
                    
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <DollarSign className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Budget</div>
                      <div className="stat-value text-lg">${selectedTrip.budget}</div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <Receipt className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Expenses</div>
                      <div className="stat-value text-lg">
                        ${(selectedTrip?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <Users className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Group Expenses</div>
                      <div className="stat-value text-lg">
                        ${(selectedTrip?.expenses?.filter(expense => expense.isGroupExpense)
                          .reduce((sum, expense) => sum + expense.amount, 0) || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-primary">
                        <User className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Personal Expenses</div>
                      <div className="stat-value text-lg">
                        ${(selectedTrip?.expenses?.filter(expense => !expense.isGroupExpense && expense.createdBy === currentUser._id)
                          .reduce((sum, expense) => sum + expense.amount, 0) || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="flex items-center gap-2 font-bold">
                          <Plane className="w-4 h-4" /> Transportation
                        </h3>
                        <p className="text-sm">{selectedTrip.transportation}</p>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="flex items-center gap-2 font-bold">
                          <Hotel className="w-4 h-4" /> Accommodation
                        </h3>
                        <p className="text-sm">{selectedTrip.accommodation}</p>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="flex items-center gap-2 font-bold">
                          <Utensils className="w-4 h-4" /> Activities
                        </h3>
                        <ul className="text-sm">
                          {selectedTrip.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Trip Expenses */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Expenses</h3>
                    <div className="tabs tabs-boxed mb-4">
                      <a className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`} onClick={() => setActiveTab('all')}>
                        All
                      </a>
                      <a className={`tab ${activeTab === 'group' ? 'tab-active' : ''}`} onClick={() => setActiveTab('group')}>
                        Group
                      </a>
                      <a className={`tab ${activeTab === 'personal' ? 'tab-active' : ''}`} onClick={() => setActiveTab('personal')}>
                        Personal
                      </a>
                    </div>

                    <div className="space-y-4">
                      {selectedTrip?.expenses
                        ?.filter(expense => {
                          if (activeTab === 'all') return true;
                          if (activeTab === 'group') return expense.isGroupExpense;
                          if (activeTab === 'personal') return !expense.isGroupExpense && expense.createdBy === currentUser._id;
                          return true;
                        })
                        .map((expense) => (
                          <div key={expense._id} className="card bg-base-200">
                            <div className="card-body">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{expense.description}</h4>
                                  <p className="text-sm text-gray-500">
                                    {expense.isGroupExpense ? 'Group Expense' : 'Personal Expense'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">${expense.amount.toFixed(2)}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button 
                      className="btn btn-outline"
                      onClick={() => toggleShareModal(true)}
                    >
                      Share Trip
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        setNewTripForm(selectedTrip);
                        toggleEditModal(true);
                      }}
                    >
                      Edit Trip
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Trip Modal */}
      {showNewTripModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Create New Trip</h3>
            <button
              onClick={() => setShowNewTripModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            
            <form onSubmit={handleCreateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label className="label">Trip Title</label>
                <input 
                  type="text" 
                  placeholder="Enter trip title" 
                  className="input input-bordered"
                  value={newTripForm.title}
                  onChange={(e) => setNewTripForm({ ...newTripForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Location</label>
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="input input-bordered"
                  value={newTripForm.location}
                  onChange={(e) => {
                    setNewTripForm({ ...newTripForm, location: e.target.value });
                    handleLocationSearch(e.target.value);
                  }}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Start Date</label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={newTripForm.startDate}
                  onChange={(e) => setNewTripForm({ ...newTripForm, startDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">End Date</label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={newTripForm.endDate}
                  onChange={(e) => setNewTripForm({ ...newTripForm, endDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Budget</label>
                <input 
                  type="number" 
                  placeholder="Enter budget" 
                  className="input input-bordered"
                  value={newTripForm.budget}
                  onChange={(e) => setNewTripForm({ ...newTripForm, budget: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Number of Members</label>
                <input 
                  type="number" 
                  placeholder="Enter number of members" 
                  className="input input-bordered"
                  value={newTripForm.members}
                  onChange={(e) => setNewTripForm({ ...newTripForm, members: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  placeholder="Enter trip description"
                  value={newTripForm.description}
                  onChange={(e) => setNewTripForm({ ...newTripForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">Activities (comma-separated)</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Hiking, Swimming, Sightseeing"
                  value={newTripForm.activities.join(', ')}
                  onChange={(e) => setNewTripForm({ 
                    ...newTripForm, 
                    activities: e.target.value.split(',').map(activity => activity.trim())
                  })}
                />
              </div>

              <div className="form-control">
                <label className="label">Transportation</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Air France"
                  value={newTripForm.transportation}
                  onChange={(e) => setNewTripForm({ ...newTripForm, transportation: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">Accommodation</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Hotel Name"
                  value={newTripForm.accommodation}
                  onChange={(e) => setNewTripForm({ ...newTripForm, accommodation: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">Image URL</label>
                <input 
                  type="url" 
                  className="input input-bordered"
                  placeholder="Enter image URL"
                  value={newTripForm.image}
                  onChange={(e) => setNewTripForm({ ...newTripForm, image: e.target.value })}
                />
              </div>
            </form>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowNewTripModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleCreateTrip}
                className="btn btn-primary"
                disabled={isTripSubmitting}
              >
                {isTripSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Create Trip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {showEditModal && selectedTrip && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Edit Trip</h3>
            <button
              onClick={() => toggleEditModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            
            <form onSubmit={handleUpdateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label className="label">Trip Title</label>
                <input 
                  type="text" 
                  placeholder="Enter trip title" 
                  className="input input-bordered"
                  value={newTripForm.title}
                  onChange={(e) => setNewTripForm({ ...newTripForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Location</label>
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="input input-bordered"
                  value={newTripForm.location}
                  onChange={(e) => {
                    setNewTripForm({ ...newTripForm, location: e.target.value });
                    handleLocationSearch(e.target.value);
                  }}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Start Date</label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={newTripForm.startDate}
                  onChange={(e) => setNewTripForm({ ...newTripForm, startDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">End Date</label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={newTripForm.endDate}
                  onChange={(e) => setNewTripForm({ ...newTripForm, endDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Budget</label>
                <input 
                  type="number" 
                  placeholder="Enter budget" 
                  className="input input-bordered"
                  value={newTripForm.budget}
                  onChange={(e) => setNewTripForm({ ...newTripForm, budget: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">Number of Members</label>
                <input 
                  type="number" 
                  placeholder="Enter number of members" 
                  className="input input-bordered"
                  value={newTripForm.members}
                  onChange={(e) => setNewTripForm({ ...newTripForm, members: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  placeholder="Enter trip description"
                  value={newTripForm.description}
                  onChange={(e) => setNewTripForm({ ...newTripForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">Activities (comma-separated)</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Hiking, Swimming, Sightseeing"
                  value={newTripForm.activities.join(', ')}
                  onChange={(e) => setNewTripForm({ 
                    ...newTripForm, 
                    activities: e.target.value.split(',').map(activity => activity.trim())
                  })}
                />
              </div>

              <div className="form-control">
                <label className="label">Transportation</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Air France"
                  value={newTripForm.transportation}
                  onChange={(e) => setNewTripForm({ ...newTripForm, transportation: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">Accommodation</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  placeholder="e.g. Hotel Name"
                  value={newTripForm.accommodation}
                  onChange={(e) => setNewTripForm({ ...newTripForm, accommodation: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">Image URL</label>
                <input 
                  type="url" 
                  className="input input-bordered"
                  placeholder="Enter image URL"
                  value={newTripForm.image}
                  onChange={(e) => setNewTripForm({ ...newTripForm, image: e.target.value })}
                />
              </div>
            </form>

            <div className="modal-action">
              <button className="btn" onClick={() => toggleEditModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleUpdateTrip}
                className="btn btn-primary"
                disabled={isTripSubmitting}
              >
                {isTripSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Update Trip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Trip Modal */}
      {showShareModal && selectedTrip && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Share Trip</h3>
            <button
              onClick={() => toggleShareModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleShareTrip(selectedTrip._id, shareForm);
            }} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Share with Users</span>
                </label>
                <select
                  multiple
                  className="select select-bordered"
                  value={shareForm.sharedWith}
                  onChange={(e) => setShareForm({
                    ...shareForm,
                    sharedWith: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {currentUser?.friend?.map(friend => (
                    <option key={friend._id} value={friend._id}>
                      {friend.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Share with Groups</span>
                </label>
                <select
                  multiple
                  className="select select-bordered"
                  value={shareForm.sharedGroups}
                  onChange={(e) => setShareForm({
                    ...shareForm,
                    sharedGroups: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Make Public</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={shareForm.isPublic}
                    onChange={(e) => setShareForm({
                      ...shareForm,
                      isPublic: e.target.checked
                    })}
                  />
                </label>
              </div>
            </form>

            <div className="modal-action">
              <button className="btn" onClick={() => toggleShareModal(false)}>
                Cancel
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleShareTrip(selectedTrip._id, shareForm);
                }}
                className="btn btn-primary"
                disabled={isTripSubmitting}
              >
                {isTripSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Share Trip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPage;