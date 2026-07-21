const uniqueImages = (images) => [...new Set(images.filter(Boolean))];

const normalizePropertyGallery = (property) => {
  const source = typeof property?.toObject === "function" ? property.toObject() : property || {};
  const galleryImages = uniqueImages([
    source.coverImage,
    ...(Array.isArray(source.galleryImages) ? source.galleryImages : []),
    ...(Array.isArray(source.gallery) ? source.gallery : []),
    source.image,
  ]);
  const coverImage = source.coverImage || source.galleryImages?.[0] || source.gallery?.[0] || source.image || galleryImages[0] || "";
  const orderedGallery = coverImage && galleryImages.includes(coverImage)
    ? [coverImage, ...galleryImages.filter((image) => image !== coverImage)]
    : galleryImages;

  return { ...source, coverImage: orderedGallery[0] || "", galleryImages: orderedGallery };
};

module.exports = { normalizePropertyGallery };