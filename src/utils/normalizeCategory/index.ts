export const normalizeCategory = (cat?: string | null) => {
  if (!cat) return null;
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};
