import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { sendGroupMessage, selectedGroup, isMessageSending } = useGroupStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const messageData = {
        text: text.trim(),
        image: imagePreview,
      };

      if (selectedGroup && selectedGroup._id) {
        await sendGroupMessage(messageData);
      } else if (selectedUser && selectedUser._id) {
        await sendMessage(messageData);
      } else {
        toast.error("Please select a valid chat or group first");
        return;
      }

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-ghost btn-sm"
        disabled={isMessageSending}
      >
        <Image className="w-4 h-4" />
      </button>
      
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="input input-bordered flex-1"
        disabled={isMessageSending}
      />
      
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={isMessageSending || (!text.trim() && !imagePreview)}
      >
        {isMessageSending ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};

export default MessageInput;