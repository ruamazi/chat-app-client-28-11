import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarSkeleton from "./SidebarSkeleton";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
 const [showOnlineOnly, setShowOnlineOnly] = useState(false);
 const [hideSidebar, setHidebar] = useState(false);
 const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
  useChatStore();
 const { onlineUsers } = useAuthStore();

 const filteredUsers = showOnlineOnly
  ? users.filter((user) => onlineUsers.includes(user._id))
  : users;

 useEffect(() => {
  getUsers();
 }, [getUsers]);

 if (isUsersLoading) return <SidebarSkeleton />;

 return (
  <aside
   className={`${
    hideSidebar ? "w-6" : "w-20 lg:w-72"
   } h-full border-r border-base-300 flex flex-col transition-all duration-200 justify-between`}
  >
   <button
    className="border-b border-base-300 p-3 flex flex-col items-center justify-center hover:bg-base-300"
    onClick={() => setHidebar((prev) => !prev)}
   >
    {hideSidebar ? (
     <ChevronRight className="size-6" />
    ) : (
     <ChevronLeft className="size-6" />
    )}
   </button>
   <div
    className={`${hideSidebar ? "hidden" : ""} overflow-y-auto w-full py-3`}
   >
    {filteredUsers.map((user) => (
     <button
      key={user._id}
      onClick={() => setSelectedUser(user)}
      className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${
             selectedUser?._id === user._id
              ? "bg-base-300 ring-1 ring-base-300"
              : ""
            }
          `}
     >
      <div className="relative mx-auto lg:mx-0">
       <img
        src={user.profilePic || "/avatar.png"}
        alt={user.name}
        className="size-12 object-cover rounded-full"
       />
       {onlineUsers.includes(user._id) && (
        <span
         className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
        />
       )}
      </div>

      {/* User info - only visible on larger screens */}
      <div className="hidden lg:block text-left min-w-0">
       <div className="font-medium truncate">{user.username}</div>
       <div className="text-sm text-zinc-400">
        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
       </div>
      </div>
     </button>
    ))}

    {filteredUsers.length === 0 && (
     <div className="text-center text-zinc-500 py-4">No online users</div>
    )}
   </div>
   <div
    className={`${
     hideSidebar ? "hidden" : ""
    } border-b border-base-300 w-full p-3 flex flex-col items-center justify-center`}
   >
    {/*Online filter toggle */}
    <div className="mt-3 lg:flex items-center gap-2">
     <label className="cursor-pointer flex items-center gap-2">
      <input
       type="checkbox"
       checked={showOnlineOnly}
       onChange={(e) => setShowOnlineOnly(e.target.checked)}
       className="checkbox checkbox-sm"
      />
      <span className="text-xs text-center">online users</span>
     </label>
     <span className="text-xs text-zinc-500">
      ({onlineUsers.length - 1} online)
     </span>
    </div>
   </div>
  </aside>
 );
};

export default Sidebar;
