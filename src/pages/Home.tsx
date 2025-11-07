import { useEffect, useRef, useState } from 'react';
import { Star, Wifi, Clock, Waves, UtensilsCrossed, Car, Dumbbell, Bell, BedDouble } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PropertyCard from '../components/PropertyCard';
import { properties as staticProperties } from '../data/properties';
import { testimonials } from '../data/testimonials';
import { PublicAPI } from '../api/client';
import { HomeImage as HomeImageType, Property } from '../types';

export default function Home() {
  const propertiesRef = useRef<HTMLDivElement>(null);
  const [heroImage, setHeroImage] = useState<HomeImageType | null>(null);
  const [propertyImages, setPropertyImages] = useState<HomeImageType[]>([]);
  const [testimonialImages, setTestimonialImages] = useState<HomeImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToProperties = () => {
    propertiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      // Fetch hero image
      const heroImages = await PublicAPI.homeImages('hero');
      if (heroImages && heroImages.length > 0) {
        setHeroImage(heroImages[0]);
      }
      
      // Fetch property images
      const propImages = await PublicAPI.homeImages('property');
      if (propImages && propImages.length > 0) {
        setPropertyImages(propImages);
      }
      
      // Fetch testimonial images
      const testimonialImgs = await PublicAPI.homeImages('testimonial');
      if (testimonialImgs && testimonialImgs.length > 0) {
        setTestimonialImages(testimonialImgs);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default hero image URL in case no image is loaded from backend
  const defaultHeroImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80";

  return (
    <>
      <SEO
        title="Home"
        description="Discover the perfect blend of comfort and elegance at Sunshine Hotel in Wagholi, Pune. Experience luxury accommodation with world-class amenities."
        canonical="/"
        ogImage={heroImage?.url || defaultHeroImageUrl}
      />

      <section className="relative h-[60vh] sm:h-[70vh] md:h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage?.url || defaultHeroImageUrl}
            alt={heroImage?.alt || "Sunshine Hotel"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
            Enjoy A Luxury Experience
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed px-2">
            Discover the perfect blend of comfort and elegance in the heart of Wagholi, Pune.
          </p>
          <button
            onClick={scrollToProperties}
            className="bg-[#F59E0B] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#d97706] transition-colors shadow-lg transform hover:scale-105"
          >
            Discover More
          </button>
        </div>
      </section>

      <section ref={propertiesRef} className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Premium Properties
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto px-4">
              Choose from our selection of luxurious rooms and suites designed for your comfort
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {propertyImages.length > 0 ? (
              propertyImages.map((image) => {
                // Convert HomeImage to Property type for PropertyCard
                const property: Property = {
                  id: image._id || String(Math.random()),
                  title: image.alt,
                  description: image.meta?.description || 'Luxury accommodation with premium amenities',
                  rating: image.meta?.rating || 4.8,
                  image: image.url,
                  bookingUrl: image.meta?.bookingUrl || ''
                };
                return <PropertyCard key={property.id} property={property} />;
              })
            ) : (
              // Fallback to static properties if no images from backend
              staticProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
              World-Class Amenities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280]">
              Everything you need for a perfect stay
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {[
              { icon: Wifi, name: 'Free Wi-Fi' },
              { icon: Clock, name: '24/7 Front Desk' },
              { icon: UtensilsCrossed, name: 'Restaurant' },
              { icon: Car, name: 'Free Parking' },
              { icon: Bell, name: 'Room Service' },
              { icon: BedDouble, name: 'Spacious Rooms' }
            ].map((amenity, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                  <amenity.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#F59E0B]" />
                </div>
                <p className="font-semibold text-[#111827] text-sm sm:text-base">{amenity.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
              What Our Guests Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280]">
              Read reviews from our satisfied guests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonialImages.length > 0 ? (
              testimonialImages.map((image) => {
                // Convert HomeImage to Testimonial format
                const testimonial = {
                  id: image._id || String(Math.random()),
                  name: image.meta?.name || image.alt,
                  rating: image.meta?.rating || 5,
                  comment: image.meta?.comment || '',
                  avatar: image.url
                };
                return (
                  <div key={testimonial.id} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#111827] text-sm sm:text-base truncate">{testimonial.name}</h3>
                        <div className="flex gap-1">
                          {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-sm sm:text-base">{testimonial.comment}</p>
                  </div>
                );
              })
            ) : (
              // Fallback to static testimonials if no images from backend
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#111827] text-sm sm:text-base truncate">{testimonial.name}</h3>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#6B7280] leading-relaxed text-sm sm:text-base">{testimonial.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#0B132B] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
            Ready to Experience Luxury?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            Book your stay with us today and create unforgettable memories
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#F59E0B] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#d97706] transition-colors shadow-lg transform hover:scale-105"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
