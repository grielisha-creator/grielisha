export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const baseUrl = rawUrl.replace(/\/api\/?$/, '');
  
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
