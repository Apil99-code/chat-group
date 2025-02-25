import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import Expense from "../components/ExpensePage ";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Chat + Expense Container */}
            <div className="flex flex-1">
              {/* Chat Section */}
              <div className="flex-1">
                {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
              </div>

              {selectedUser && (
                <div className="w-[30%] border-l border-black overflow-y-auto">
                  <Expense />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
