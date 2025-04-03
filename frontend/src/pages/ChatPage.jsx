import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTripStore } from '../store/useTripStore';
import { MessageSquare, Users, Search, Plus, Send, Image, Paperclip, MapPin, Plane } from 'lucide-react';
import CreateTripFromChatModal from '../components/CreateTripFromChatModal';

const ChatPage = () => {
  const { authUser } = useAuthStore();
  const { setSelectedChatGroup } = useTripStore();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  
  // Mock data - replace with actual data from your backend
  const [chats] = useState([
    {
      id: 1,
      name: 'Paris Trip Group',
      type: 'group',
      lastMessage: "Who's up for dinner tonight?",
      timestamp: '2:30 PM',
      unread: 3,
      members: ['John', 'Sarah', 'Mike'],
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80'
    },
    {
      id: 2,
      name: 'Tokyo Explorer',
      type: 'group',
      lastMessage: 'Check out this cool spot!',
      timestamp: '11:20 AM',
      unread: 1,
      members: ['Alice', 'Bob', 'Charlie'],
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=100&q=80'
    }
  ]);

  const handleCreateTrip = (chat) => {
    setSelectedChatGroup(chat);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chat List */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Chats</h2>
                  <button className="btn btn-ghost btn-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="input input-bordered w-full pl-10"
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="space-y-2">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-base-200 ${
                        activeChat?.id === chat.id ? 'bg-base-200' : ''
                      }`}
                      onClick={() => setActiveChat(chat)}
                    >
                      <div className="relative">
                        <img
                          src={chat.image}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {chat.type === 'group' && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-content rounded-full p-1">
                            <Users className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{chat.name}</h3>
                          <span className="text-sm text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="badge badge-primary badge-sm mt-1">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      {chat.type === 'group' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateTrip(chat);
                          }}
                        >
                          <Plane className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="md:col-span-3">
            {activeChat ? (
              <div className="card bg-base-100 shadow-xl h-[calc(100vh-8rem)]">
                <div className="card-body p-4 flex flex-col">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={activeChat.image}
                        alt={activeChat.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold">{activeChat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {activeChat.members.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4">
                    {/* Add your messages here */}
                  </div>

                  {/* Message Input */}
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-ghost btn-sm">
                      <Image className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input input-bordered flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-primary">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl h-[calc(100vh-8rem)]">
                <div className="card-body flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold">Select a chat to start messaging</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTripFromChatModal />
    </div>
  );
};

export default ChatPage; 