// import React, { useEffect } from 'react';
// import  styles from '../styles/profile.module.css';
// import { FaRegCircleUser } from "react-icons/fa6";
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserData } from '../redux/slices/userSlice'; // Import the async action
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



// const backendurl = import.meta.env.VITE_BACKEND_URL;
// const Profile = () => {
//   const dispatch = useDispatch();

//   // Access user data and status from the Redux store
//   const { user, status, error } = useSelector((state) => state.user);

//   // State for managing profile edit form data
//   const [editProfile, setEditProfile] = React.useState({
//     username: '',
//     email: '',
//     password: ''
//   });

//   // Fetch user data when component mounts
//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchUserData());
//     }

//     // Ensure the form is updated once user data is available
//     if (user) {
//       setEditProfile({
//         username: user.username,
//         email: user.email,
//         password: '', // Keep password empty initially for security
//       });
//     }
//   }, [status, user, dispatch]); // Trigger the effect when 'user' or 'status' changes

//   // Handle changes in the edit form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditProfile({ ...editProfile, [name]: value });
//   };

//   // Submit the updated profile information to the backend API
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
      
//       const response = await fetch(`${backendUrl}/updateuser`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-username': localStorage.getItem('username'), // Include username in headers for authentication
//         },
//         body: JSON.stringify({
//           name: editProfile.username,
//           email: editProfile.email,
//           password: editProfile.password,
//         }),
//         credentials: 'include'
//       });

//       if (response.ok) {
//         alert('Profile updated successfully!');
//         // Update Redux store with the edited data
//         dispatch(fetchUserData()); // Refresh user data after update
//         setEditProfile({ ...editProfile, password: '' });
//       } else {
//         alert('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('An error occurred while updating your profile');
//     }
//   };

//   // Handle loading and error states
//   if (status === 'loading') {
//     return <p>Loading profile...</p>;
//   }

//   if (status === 'failed') {
//     return <p>Error: {error}</p>;
//   }

//   if (!user) {
//     return <p>No user data available</p>;
//   }

//   return (
//     <div className={styles['profile-page']}>
//     <ToastContainer position="top-center" />
//       <h1>Profile</h1>

//       {/* Display Profile Information */}
//       <div className={styles['profile-info']}>
//         <FaRegCircleUser size={100} />
//         <p><strong>Name:</strong> {user.username}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//       </div>

//       {/* Edit Form for Username, Email, and Password */}
//       <div className={styles['profile-edit']}>
//   <h2>Edit Profile</h2>
//   <form onSubmit={handleSubmit} className={styles['updateform']}>
//     <div className={styles['form-group']}>
//       <label htmlFor="username">Profile Name:</label>
//       <input
//         id="username"
//         type="text"
//         name="username"
//         value={editProfile.username}
//         placeholder="Enter your profile name"
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className={styles['form-group']}>
//       <label htmlFor="email">Email:</label>
//       <input
//         id="email"
//         type="email"
//         name="email"
//         value={editProfile.email}
//         placeholder="Enter your email address"
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className={styles['form-group']}>
//       <label htmlFor="password">Password:</label>
//       <input
//         id="password"
//         type="password"
//         name="password"
//         value={editProfile.password}
//         placeholder="Enter a new password"
//         onChange={handleInputChange}
//       />
//     </div>
//     <button type="submit">Update Profile</button>
//   </form>
// </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from 'react';
import styles from '../styles/profile.module.css';
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../redux/slices/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  const [editProfile, setEditProfile] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Fetch user data
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserData());
    }
  }, [status, dispatch]);

  // Set form data when user is available
  useEffect(() => {
    if (user) {
      setEditProfile({
        username: user.username || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'),
        },
        body: JSON.stringify({
          name: editProfile.username,
          email: editProfile.email,
          password: editProfile.password,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        dispatch(fetchUserData());
        setEditProfile((prev) => ({ ...prev, password: '' }));
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating your profile');
    }
  };

  if (status === 'loading') return <p>Loading profile...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className={styles['profile-page']}>
      <ToastContainer position="top-center" />
      <h1>Profile</h1>

      <div className={styles['profile-info']}>
        <FaRegCircleUser size={100} />
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className={styles['profile-edit']}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles['updateform']}>
          <div className={styles['form-group']}>
            <label htmlFor="username">Profile Name:</label>
            <input
              id="username"
              type="text"
              name="username"
              value={editProfile.username}
              placeholder="Enter your profile name"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={editProfile.email}
              placeholder="Enter your email address"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={editProfile.password}
              placeholder="Enter a new password"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
