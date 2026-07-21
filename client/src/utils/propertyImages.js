const uniqueImages = (images) => [...new Set(images.filter(Boolean))];

export const getPropertyGalleryImages = (property = {}) => {
  const galleryImages = uniqueImages([
    ...(Array.isArray(property.galleryImages) ? property.galleryImages : []),
    ...(Array.isArray(property.gallery) ? property.gallery : []),
  ]);

  const coverImage = property.coverImage || "";
  const legacyImage = property.image || "";

  const orderedImages = coverImage
    ? [coverImage, ...galleryImages.filter((image) => image !== coverImage)]
    : galleryImages;

  if (orderedImages.length) return orderedImages;
  if (legacyImage) return [legacyImage];
  return [];
};

export const getPropertyCoverImage = (property = {}) => {
  if (property?.coverImage) return property.coverImage;

  const galleryImages = Array.isArray(property?.galleryImages)
    ? property.galleryImages.filter(Boolean)
    : [];

  if (galleryImages.length) return galleryImages[0];
  if (property?.image) return property.image;
  return "";
};

export const getPropertyPrimaryImage = (property = {}) => {
  return getPropertyCoverImage(property) || getPropertyGalleryImages(property)[0] || "";
};
