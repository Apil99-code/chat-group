import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import GroupChatContainer from "../components/GroupChatContainer";
import Expense from "../components/ExpensePage ";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            <div className="flex flex-1">
              <div className="flex-1">
                {!selectedUser && !selectedGroup ? (
                  <NoChatSelected />
                ) : selectedUser ? (
                  <ChatContainer />
                ) : (
                  <GroupChatContainer />
                )}
              </div>

              {(selectedUser || selectedGroup) && (
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