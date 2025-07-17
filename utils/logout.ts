// utils/logout.ts
export const logoutAdmin = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
};
export const logoutUser = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('acccess_token');
    window.location.href = '/';
  }
};
