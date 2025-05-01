import React, { useEffect, useState } from 'react';
import '../styles/CommunityManager.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const CommunityManager = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch all communities
    fetch("http://localhost:3000/community", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCommunities(data);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
      });
  }, []);

  const handleDeleteCommunity = async (communityId) => {
    try {
      const response = await fetch("http://localhost:3000/admin/delete_community", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({community_name: communityId }),
      });
      if (response.ok) {
        toast.success("Community deleted successfully!");
        setCommunities(communities.filter((c) => c.id !== communityId));
      } else {
        toast.error("Failed to delete community. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting community:", error);
      toast.error("An error occurred while deleting the community.");
    }
  };

  const handleDeleteCommunityMessages = async (communityId) => {
    try {
        console.log(communityId);

      const response = await fetch("http://localhost:3000/admin/delete_community_message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ community_name:communityId }),
      });
      if (response.ok) {
        toast.success("Community messages deleted successfully!");
      } else {
        toast.error("Failed to delete community messages. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting community messages:", error);
      toast.error("An error occurred while deleting community messages.");
    }
  };

  const handleViewCommunityChat = (communityId) => {
  navigate('/communities/'+communityId);
  };

  return (
    <div className="community-manager">
      <h1>Community Manager</h1>
      <table style={{ border: "1px solid black", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Community Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {communities.map((community) => (
            <tr key={community.id} >
              <td style={{ border: "1px solid black", padding: "8px" }}>{community.name}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <button
                  onClick={() => handleViewCommunityChat(community.name)}
                  style={{ marginRight: "10px" }}
                >
                  View Chat
                </button>
                <button
                  onClick={() => handleDeleteCommunity(community.name)}
                  style={{ marginRight: "10px" }}
                >
                  Delete Community
                </button>
                <button onClick={() => handleDeleteCommunityMessages(community.name)}>
                  Delete Messages
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default CommunityManager;
