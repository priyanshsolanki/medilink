import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = '';

// Authenticate user with Cognito
export const authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    const user = {
      Username: email,
    };
  });
};

// Logout user and clear local storage
export const logout = async () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('token');
  window.location.href = '/';
};
