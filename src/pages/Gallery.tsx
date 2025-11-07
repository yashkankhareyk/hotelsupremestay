import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
// Remove this import: import { galleryImages } from '../data/gallery';
import { X } from 'lucide-react';
import { PublicAPI } from '../api/client';
import { GalleryImage } from '../types';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const images = await PublicAPI.gallery();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <>
      <SEO
        title="Gallery"
        description="Explore our stunning gallery showcasing the luxury and elegance of Sunshine Hotel in Wagholi, Pune."
        canonical="/gallery"
      />

      <section className="relative h-[50vh] sm:h-[60vh] md:h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
            Our Gallery
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            Explore the beauty of our hotel
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 sm:h-48">
              <p className="text-base sm:text-lg md:text-xl">Loading gallery images...</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="flex justify-center items-center h-40 sm:h-48">
              <p className="text-base sm:text-lg md:text-xl">No gallery images available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={image._id || index}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group h-64 sm:h-72 md:h-80"
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage !== null && galleryImages[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-[#F59E0B] transition-colors p-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close image"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </button>

          <div className="max-w-full max-h-[95vh] sm:max-w-6xl relative flex items-center justify-center">
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 text-white">
              <p className="text-base sm:text-lg md:text-xl font-semibold">{galleryImages[selectedImage].alt}</p>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Image {selectedImage + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
