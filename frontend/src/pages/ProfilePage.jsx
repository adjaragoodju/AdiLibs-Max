// src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatar_url || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });

    // Clear error when user types
    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: '',
      });
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: '',
      });
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (
      profileForm.avatarUrl &&
      !/^(https?:\/\/)/.test(profileForm.avatarUrl)
    ) {
      newErrors.avatarUrl = 'Avatar URL must start with http:// or https://';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        passwordForm.newPassword
      )
    ) {
      newErrors.newPassword =
        'Password must include uppercase, lowercase, number and special character';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsSubmittingProfile(true);

    try {
      await updateProfile(profileForm);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmittingPassword(true);

    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success('Password changed successfully');

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: 'Current password is incorrect',
        });
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setDeleteError('Password is required to delete your account');
      return;
    }

    setIsSubmittingDelete(true);

    try {
      await api.delete('/users/account', {
        data: { password: deletePassword },
      });

      toast.success('Your account has been deleted');
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        setDeleteError('Password is incorrect');
      } else {
        toast.error('Failed to delete account');
      }
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>My Profile</h1>

      <div className='space-y-10'>
        {/* Profile Information Form */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Profile Information</h2>

          <form onSubmit={handleProfileSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Name
              </label>
              <input
                id='name'
                type='text'
                name='name'
                value={profileForm.name}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  profileErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {profileErrors.name && (
                <p className='mt-1 text-sm text-red-600'>
                  {profileErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='bio'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Bio
              </label>
              <textarea
                id='bio'
                name='bio'
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Tell us something about yourself...'
              />
            </div>

            <div>
              <label
                htmlFor='avatarUrl'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Avatar URL
              </label>
              <input
                id='avatarUrl'
                type='text'
                name='avatarUrl'
                value={profileForm.avatarUrl}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  profileErrors.avatarUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='https://example.com/avatar.jpg'
              />
              {profileErrors.avatarUrl && (
                <p className='mt-1 text-sm text-red-600'>
                  {profileErrors.avatarUrl}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmittingProfile}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='currentPassword'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Current Password
              </label>
              <input
                id='currentPassword'
                type='password'
                name='currentPassword'
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordErrors.currentPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {passwordErrors.currentPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='newPassword'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                New Password
              </label>
              <input
                id='newPassword'
                type='password'
                name='newPassword'
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordErrors.newPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {passwordErrors.newPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Confirm New Password
              </label>
              <input
                id='confirmPassword'
                type='password'
                name='confirmPassword'
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordErrors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {passwordErrors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmittingPassword}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmittingPassword
                ? 'Changing Password...'
                : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Delete Account</h2>

          <p className='text-gray-600 mb-4'>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className='w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            >
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className='space-y-6'>
              <div>
                <label
                  htmlFor='deletePassword'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Enter Your Password to Confirm
                </label>
                <input
                  id='deletePassword'
                  type='password'
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError('');
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    deleteError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {deleteError && (
                  <p className='mt-1 text-sm text-red-600'>{deleteError}</p>
                )}
              </div>

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmittingDelete}
                  className='flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmittingDelete ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
