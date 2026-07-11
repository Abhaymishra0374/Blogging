// Base URL of the backend server (without the /api suffix), used to build
// absolute URLs for uploaded images.
export const SERVER_URL = "http://localhost:5000";

export const resolveImage = (image) => {
  if (!image) return "https://picsum.photos/600/400?blur=1";
  if (image.startsWith("http")) return image;
  return `${SERVER_URL}${image}`;
};
