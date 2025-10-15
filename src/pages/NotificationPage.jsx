import { axiosInstance } from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getFriendRequests,
  getNotifications,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // Local state for optimistic update
  const [hiddenIds, setHiddenIds] = useState([]);

  const markAsRead = async (id) => {
    setHiddenIds((prev) => [...prev, id]); // Optimistically hide
    await axiosInstance.patch(`/users/notifications/${id}/read`);
    queryClient.invalidateQueries(["notifications"]);
  };

  const handleNotificationClick = async (notif) => {
    // Mark as read
    await markAsRead(notif._id);
    // Navigate to chat page with the sender (notif.from)
    navigate(`/chat/${notif.from?._id}`);
  };

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* MESSAGE NOTIFICATIONS */}
            {notifications
              .filter((n) => n.type === "message" && !hiddenIds.includes(n._id))
              .map((notif) => (
                <div
                  key={notif._id}
                  className="card shadow-sm mb-4 bg-[#232323] cursor-pointer transition hover:brightness-110"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-3">
                      <div className="avatar mt-1 size-10 rounded-full">
                        {notif.from?.profilePic ? (
                          <img
                            src={notif.from.profilePic}
                            alt={notif.from.fullName || "User"}
                          />
                        ) : (
                          <div className="bg-base-300 w-10 h-10 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          New message from {notif.from?.fullName || "Unknown"}
                        </h3>
                        <p className="text-sm my-1">{notif.message}</p>
                        <p className="text-xs opacity-70">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        className="btn btn-xs btn-success ml-auto"
                        disabled={notif.isRead}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif._id);
                        }}
                      >
                        {notif.isRead ? "Read" : "Mark as Read"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* FRIEND REQUEST ACCEPTED NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card shadow-sm mb-4 bg-[#232323]"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            {notification.recipient?.profilePic ? (
                              <img
                                src={notification.recipient.profilePic}
                                alt={notification.recipient.fullName || "User"}
                              />
                            ) : (
                              <div className="bg-base-300 w-10 h-10 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient?.fullName || "Unknown"}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient?.fullName || "Unknown"}{" "}
                              accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 &&
              notifications.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationPage;
