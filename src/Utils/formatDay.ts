export const formatDay = (dateTime: string): string => {
  const parts = dateTime.split(' ');

  return parts[0].replace(/-/g, '/');
};
