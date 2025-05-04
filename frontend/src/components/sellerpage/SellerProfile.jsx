import React from 'react'
import { useState,useEffect } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import styles from '../../styles/userstyles/UserProfile.module.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const backendurl = import.meta.env.VITE_BACKEND_URL;
const SellerProfile = () => {
 // State for storing profile information and edit form data
 const [profile, setProfile] = useState(null);
 const [editProfile, setEditProfile] = useState({
   username: '',
   email: '',
   password: ''
 });

 // Fetch user data from the API when the component mounts
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
 

 // Handle changes in the edit form
 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setEditProfile({ ...editProfile, [name]: value });
 };

 // Submit the updated profile information to the backend API
 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
     const response = await fetch(`${backendUrl}/updateuser`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'), // Include username in headers
       },
       body: JSON.stringify({
         username: editProfile.username,
         email: editProfile.email,
         password: editProfile.password // Send all fields, but the backend will handle them accordingly
       }),
       credentials: 'include'
     });

     if (response.ok) {
       alert('Profile updated successfully!');
       // Update the profile data with the edited data
       setProfile((prev) => ({
         ...prev,
         username: editProfile.username,
         email: editProfile.email,
       }));
       // Reset the password field in the edit form
       setEditProfile({ ...editProfile, password: '' });
     } else {
       alert('Failed to update profile');
     }
   } catch (error) {
     console.error('Error updating profile:', error);
     alert('An error occurred while updating your profile');
   }
 };

 if (!profile) {
   return <p>Loading profile...</p>; // Show loading message until data is fetched
 }

 return (
   <div className={styles["profile-page"]}>
   <ToastContainer position="top-center" />
     <h1>Profile</h1>

     {/* Display Profile Information */}
     <div className={styles["profile-info"]}>
       <FaRegCircleUser size={100} />
       <p><strong>Name:</strong> {profile.username}</p>
       <p><strong>Email:</strong> {profile.email}</p>
       <p><strong>Date Of Birth : </strong>{profile.dateofbirth}</p>
       <p><strong>Role : </strong>{profile.role}</p>
     </div>

     {/* Edit Form for Username, Email, and Password */}
     <div className={styles["profile-edit"]}>
       <h2>Edit Profile</h2>
       <form onSubmit={handleSubmit} className={styles['updateform']}>
         <div className={styles['updateform']}>
           <label style={{ display: 'block'}}>Username:</label>
           <input style ={{ width: '80%', height : '30px', padding : '6px', borderRadius : '8px'}}
             type="text"
             name="username"
             value={editProfile.username}
             onChange={handleInputChange}
           />
         </div>
         <div className={styles['updateform']}>
           <label style={{ display: 'block'}}>Email:</label>
           <input  style ={{ width: '80%', height : '30px', padding : '6px', borderRadius : '8px'}}
             type="email"
             name="email"
             value={editProfile.email}
             onChange={handleInputChange}
             
           />
         </div>
         <div className={styles['updateform']}>
           <label  style={{ display: 'block'}}>Password:</label>
           <input  style ={{ width: '80%', height : '30px', padding : '6px', borderRadius : '8px'}}
             type="password"
             name="password"
             value={editProfile.password}
             onChange={handleInputChange}
           />
         </div>
         <button type="submit" style={{ margin: '10px'}}>Update Profile</button>
       </form>
     </div>
   </div>
 );
}

export default SellerProfile