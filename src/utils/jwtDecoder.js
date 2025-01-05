import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    if (!token) return null; 

    const decoded = jwtDecode(token);
    const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    return decoded[roleKey] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const getDecodedToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  return jwtDecode(token);
};
