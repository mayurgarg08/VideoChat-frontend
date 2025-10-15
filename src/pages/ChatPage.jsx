import { StreamChat } from "stream-chat";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { axiosInstance } from "../lib/axios";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const reloadAttempts = useRef(0); // Track reload attempts

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client;

    const initChat = async () => {
      setLoading(true);
      try {
        if (!tokenData?.token || !authUser || !targetUserId) return;

        if (chatClient) {
          await chatClient.disconnectUser();
          setChatClient(null);
          setChannel(null);
        }

        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const currChannel = client.channel("messaging", {
          members: [authUser._id, targetUserId],
          distinct: true,
        });

        await currChannel.watch({ presence: true });

        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
        reloadAttempts.current = 0;
      } catch (err) {
        if (reloadAttempts.current < 2) {
          reloadAttempts.current += 1;
          window.location.reload();
        } else {
          setLoading(false);
        }
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (client) client.disconnectUser();
    };
    // eslint-disable-next-line
  }, [tokenData, authUser, targetUserId]);

  useEffect(() => {
    if (!chatClient || !channel) return;

    const handleNewMessage = async (event) => {
      // Only notify the other user when YOU send a message
      if (event.user.id === authUser._id) {
        await axiosInstance.post("/users/message-notification", {
          recipientId: targetUserId, // The other user
          message: event.message.text,
          from: authUser._id, // You (the sender)
        });
      }
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [chatClient, channel, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        {channel && (
          <Channel key={channel.id} channel={channel}>
            <div className="w-full relative">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        )}
      </Chat>
    </div>
  );
};

export default ChatPage;
