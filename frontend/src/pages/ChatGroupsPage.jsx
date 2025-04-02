import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Search, Plus, Edit2, Trash2 } from 'lucide-react';

const ChatGroupsPage = () => {
  const { authUser } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Mock data - replace with actual data from your backend
  const [groups] = useState([
    {
      id: 1,
      name: 'Paris Trip Group',
      members: ['John', 'Sarah', 'Mike'],
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80',
      createdAt: '2024-02-15'
    },
    {
      id: 2,
      name: 'Tokyo Explorer',
      members: ['Alice', 'Bob', 'Charlie'],
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=100&q=80',
      createdAt: '2024-02-10'
    }
  ]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    // Add group creation logic here
    setShowCreateModal(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Chat Groups</h2>
                <p className="text-gray-500">Manage your travel chat groups</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search groups..."
                className="input input-bordered w-full pl-10"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div key={group.id} className="card bg-base-200">
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold">{group.name}</h3>
                          <p className="text-sm text-gray-500">
                            {group.members.length} members
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          {group.members.join(', ')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Created on {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Chat Group</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Add Members</span>
                </label>
                <select
                  multiple
                  value={selectedMembers}
                  onChange={(e) =>
                    setSelectedMembers(
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  className="select select-bordered min-h-[100px]"
                >
                  <option value="user1">User 1</option>
                  <option value="user2">User 2</option>
                  <option value="user3">User 3</option>
                </select>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowCreateModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ChatGroupsPage; 