export const apiUrl = import.meta.env.VITE_API_URL;

export const getToken = () => {
  const userInfo = localStorage.getItem('userInfoLms');

  if (!userInfo) {
    return null;
  }

  try {
    return JSON.parse(userInfo).token ?? null;
  } catch (error) {
    return null;
  }
};

// console.log('API URL: ', apiUrl);
