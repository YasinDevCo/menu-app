import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://menu-app-server-t9p7.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ اضافه کردن توکن به هدر درخواست‌ها
api.interceptors.request.use(
  (config: any) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Token added to request:', config.url);
        } else {
          console.log('⚠️ No token found in auth-storage');
        }
      } catch (e) {
        console.error('Error parsing auth storage', e);
      }
    } else {
      console.log('⚠️ No auth-storage in localStorage');
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// ✅ مدیریت خطای 401
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      console.log('🔴 401 Unauthorized - Removing token and redirecting');
      localStorage.removeItem('auth-storage');
      // فقط اگر در مسیر ادمین هستیم، به لاگین برو
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;