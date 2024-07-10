// frontend/src/components/SettingPage.js
import React, { useState, useEffect } from 'eact';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';

const SettingPage = () => {
  const { user, token, updateSettings } = useAuth();
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
    password: '',
    confirmPassword: '',
    notificationPreference: user.notificationPreference,
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const handleUpdateSettings = async (event) => {
    event.preventDefault();
    try {
      if (values.password && values.confirmPassword && values.password === values.confirmPassword) {
        const response = await updateSettings(values);
        console.log('Settings updated successfully:', response);
      } else {
        console.error('Error updating settings: passwords do not match');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleUpdateSettings}>
        <label>
          Password:
          <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {errors.password && <div>{errors.password}</div>}
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
          {errors.confirmPassword && <div>{errors.confirmPassword}</div>}
        </label>
        <br />
        <label>
          Notification Preference:
          <select name="notificationPreference" value={values.notificationPreference} onChange={handleChange} onBlur={handleBlur}>
            <option value="email">Email</option>
            <option value="inApp">In-App</option>
            <option value="none">None</option>
          </select>
          {errors.notificationPreference && <div>{errors.notificationPreference}</div>}
        </label>
        <br />
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

export default SettingPage;