export const apiUrl = import.meta.env.VITE_API_URL;

//fetch token for the pages that have authorization
const userInfo = localStorage.getItem('userInfoLms');
export const token = userInfo ? JSON.parse(userInfo).token : null;

// console.log('API URL: ', apiUrl);
