import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Users, Search, Plus, Send, Image, Paperclip, MapPin } from 'lucide-react';

const ChatPage = () => {
  const { authUser } = useAuthStore();
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
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${
                        activeChat?.id === chat.id ? 'bg-base-200' : ''
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={chat.image}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.unread > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-3">
            {activeChat ? (
              <div className="card bg-base-100 shadow-xl">
                {/* Chat Header */}
                <div className="card-body p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeChat.image}
                        alt={activeChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{activeChat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {activeChat.members.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm">
                        <Users className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 min-h-[400px] max-h-[calc(100vh-400px)] overflow-y-auto">
                  {/* Messages will go here */}
                  <div className="text-center text-gray-500 text-sm">
                    No messages yet
                  </div>
                </div>

                {/* Message Input */}
                <div className="card-body p-4 border-t">
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input input-bordered flex-1"
                    />
                    <button className="btn btn-primary btn-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body flex items-center justify-center min-h-[400px]">
                  <MessageSquare className="w-16 h-16 text-gray-300" />
                  <h3 className="text-xl font-bold mt-4">Select a chat to start messaging</h3>
                  <p className="text-gray-500">Choose from your existing chats or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 