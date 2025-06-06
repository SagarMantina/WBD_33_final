// import React from 'react'
// import { useState,useEffect } from 'react';
// import { FaRegCircleUser } from "react-icons/fa6";
// import styles from '../../styles/userstyles/UserProfile.module.css'
// //toastify
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// const backendurl = import.meta.env.VITE_BACKEND_URL; // Replace with your backend URL
// const UserProfile = () => {
//   // State for storing profile information and edit form data
//   const [profile, setProfile] = useState(null);
//   const [editProfile, setEditProfile] = useState({
//     username: '',
//     email: '',
//     password: ''
//   });

//   // Fetch user data from the API when the component mounts
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const backendUrl = import.meta.env.VITE_BACKEND_URL;
//         const response = await fetch(`${backendUrl}/userdata`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-username': localStorage.getItem('username'), // Include username in headers
//           },
//           credentials: 'include', // Include credentials for sending cookies
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           setProfile(data);

//           // Initialize edit form fields with fetched data
//           setEditProfile({
//             username: data.username,
//             email: data.email,
//             password: '' // Reset password field
//           });
//         } else {
//           console.error("Failed to fetch profile data");
//         }
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };
  
//     fetchProfileData();
//   }, []);
  

//   // Handle changes in the edit form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditProfile({ ...editProfile, [name]: value });
//   };

//   // Submit the updated profile information to the backend API
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const backendUrl = import.meta.env.VITE_BACKEND_URL;
//       const response = await fetch(`${backendurl}/updateuser`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-username': localStorage.getItem('username'), // Include username in headers
//         },
//         body: JSON.stringify({
//           username: editProfile.username,
//           email: editProfile.email,
//           password: editProfile.password // Send all fields, but the backend will handle them accordingly
//         }),
//         credentials: 'include'
//       });

//       if (response.ok) {
//         alert('Profile updated successfully!');
//         // Update the profile data with the edited data
//         setProfile((prev) => ({
//           ...prev,
//           username: editProfile.username,
//           email: editProfile.email,
//         }));
//         // Reset the password field in the edit form
//         setEditProfile({ ...editProfile, password: '' });
//       } else {
//         alert('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('An error occurred while updating your profile');
//     }
//   };

//   if (!profile) {
//     return <p>Loading profile...</p>; // Show loading message until data is fetched
//   }

//   return (
//     <div className={styles["profile-page"]}>
//       <h1>Profile</h1>

//       {/* Display Profile Information */}
//       <div className={styles["profile-info"]}>
//         <FaRegCircleUser size={100}  color='greenyellow'/>
//         <p><strong>Name : </strong> {profile.username}</p>
//         <p><strong>Email : </strong> {profile.email}</p>
//         <p><strong>Date Of Birth : </strong>{profile.dateofbirth}</p>
//         <p><strong>Role : </strong>{profile.role}</p>
//       </div>

//       {/* Edit Form for Username, Email, and Password */}
//       <div className={styles["profile-edit"]}>
//         <h2>Edit Profile</h2>
//         <form onSubmit={handleSubmit} className={styles['updateform']}>
//           <div className={styles["form-group"]}>
//             <label>Username:</label>
//             <input
//               type="text"
//               name="username"
//               value={editProfile.username}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={editProfile.email}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Password:</label>
//             <input
//               type="text"
//               name="password"
//               value={editProfile.password}
//               onChange={handleInputChange}
//             />
//           </div>
//           <button type="submit">Update Profile</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserProfile



import React, { useState, useEffect } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import styles from '../../styles/userstyles/UserProfile.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendurl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${backendurl}/userdata`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-username': localStorage.getItem('username'),
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setEditProfile({
            username: data.username,
            email: data.email,
            password: ''
          });
        } else {
          toast.error("Failed to fetch profile data.");
        }
      } catch (error) {
        toast.error("Error fetching profile data.");
        console.error("Error:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendurl}/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'),
        },
        body: JSON.stringify({
          name: editProfile.username,
          email: editProfile.email,
          password: editProfile.password
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");

        setProfile((prev) => ({
          ...prev,
          username: data.username,
          email: data.email,
        }));

        setEditProfile({ ...editProfile, password: '' });

        // Optional: update localStorage if username changed
        if (data.username !== localStorage.getItem('username')) {
          localStorage.setItem('username', data.username);
        }
      } else {
        if (data.errorMessage) {
          toast.error(data.errorMessage);
        } else {
          toast.error("Failed to update profile.");
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className={styles["profile-page"]}>
      <ToastContainer position="top-center" />
      <h1>Profile</h1>

      <div className={styles["profile-info"]}>
        <FaRegCircleUser size={100} color='greenyellow' />
        <p><strong>Name : </strong>{profile.username}</p>
        <p><strong>Email : </strong>{profile.email}</p>
        <p><strong>Date Of Birth : </strong>{profile.dateofbirth}</p>
        <p><strong>Role : </strong>{profile.role}</p>
      </div>

      <div className={styles["profile-edit"]}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles['updateform']}>
          <div className={styles["form-group"]}>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editProfile.username}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["form-group"]}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editProfile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["form-group"]}>
            <label>Password:</label>
            <input
              type="text"
              name="password"
              value={editProfile.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
 
    </div>
  );
};

export default UserProfile;
