// frontend/src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
    name: user.name,
    email: user.email,
    bio: user.bio,
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await updateUser(values);
      console.log('Profile updated successfully:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleUpdateProfile}>
        <label>
          Name:
          <input type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
          {errors.name && <div>{errors.name}</div>}
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {errors.email && <div>{errors.email}</div>}
        </label>
        <br />
        <label>
          Bio:
          <textarea name="bio" value={values.bio} onChange={handleChange} onBlur={handleBlur} />
          {errors.bio && <div>{errors.bio}</div>}
        </label>
        <br />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;