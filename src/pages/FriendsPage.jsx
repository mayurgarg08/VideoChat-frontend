import { useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { axiosInstance } from "../lib/axios";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/users/friends");
        setFriends(res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading friends...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Friends</h2>
      {friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(friends) &&
            friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
