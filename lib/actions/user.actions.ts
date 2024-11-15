export const fetchUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    return null;
  }
};
