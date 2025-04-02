import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Bell, BarChart3, Receipt, MapPin, Calendar, Check, X, Users, Map } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Trip mate</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/"} className="btn btn-sm btn-ghost gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link to={"/trip"} className="btn btn-sm btn-ghost gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Trip</span>
                </Link>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
                    <Receipt className="size-4" />
                    Expenses
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <Link to="/expense" className="flex items-center gap-2">
                        <Receipt className="size-4" />
                        Manage Expenses
                      </Link>
                    </li>
                    <li>
                      <Link to="/statistics" className="flex items-center gap-2">
                        <BarChart3 className="size-4" />
                        Statistics
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link to={"/homepage"} className="btn btn-sm btn-ghost gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Group</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-ghost gap-2 indicator">
                    <Bell className="size-4" />
                    <span className="indicator-item badge badge-sm badge-primary">3</span>
                  </label>
                  <div tabIndex={0} className="dropdown-content z-[1] card card-compact shadow bg-base-100 w-80">
                    <div className="card-body">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        <div className="flex gap-2">
                          <button className="btn btn-xs btn-ghost">Mark all as read</button>
                          <button className="btn btn-xs btn-ghost">
                            <Settings className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="tabs tabs-boxed mb-2">
                        <a className="tab tab-active">All</a>
                        <a className="tab">Trips</a>
                        <a className="tab">Messages</a>
                        <a className="tab">Expenses</a>
                      </div>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {/* Trip notification */}
                        <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                          <div className="bg-blue-100 p-2 rounded-full h-fit">
                            <Calendar className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">Trip Reminder</p>
                              <span className="text-xs text-gray-500">2h ago</span>
                            </div>
                            <p className="text-xs text-gray-600">Your Paris trip starts in 3 days!</p>
                          </div>
                          <button className="btn btn-xs btn-ghost">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Message notification */}
                        <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                          <div className="bg-green-100 p-2 rounded-full h-fit">
                            <MessageSquare className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">New Message</p>
                              <span className="text-xs text-gray-500">5h ago</span>
                            </div>
                            <p className="text-xs text-gray-600">John sent a message in Tokyo Explorer group</p>
                          </div>
                          <button className="btn btn-xs btn-ghost">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Expense notification */}
                        <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                          <div className="bg-red-100 p-2 rounded-full h-fit">
                            <Receipt className="w-4 h-4 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">Expense Added</p>
                              <span className="text-xs text-gray-500">1d ago</span>
                            </div>
                            <p className="text-xs text-gray-600">Sarah added a $120 expense for Hotel</p>
                          </div>
                          <button className="btn btn-xs btn-ghost">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Location notification */}
                        <div className="flex gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                          <div className="bg-purple-100 p-2 rounded-full h-fit">
                            <MapPin className="w-4 h-4 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">Location Shared</p>
                              <span className="text-xs text-gray-500">2d ago</span>
                            </div>
                            <p className="text-xs text-gray-600">Mike shared their location in Paris Adventure</p>
                          </div>
                          <button className="btn btn-xs btn-ghost">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="card-actions justify-center mt-2">
                        <Link to="/notifications" className="btn btn-sm btn-ghost btn-block">View All Notifications</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
             {/* <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link> */}
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm btn-ghost gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="btn btn-sm btn-ghost gap-2" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
