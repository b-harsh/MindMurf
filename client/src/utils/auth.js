export const saveToken = (token) => {
  localStorage.setItem('mindmate_token', token);
};

export const getToken = () => {
  return localStorage.getItem('mindmate_token');
};

export const clearToken = () => {
  localStorage.removeItem('mindmate_token');
};
