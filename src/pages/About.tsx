import { useEffect } from 'react';
import { Wifi, Clock, UtensilsCrossed, Car, Users, Calendar, Star, Bell, BedDouble } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Sunshine Hotel in Wagholi, Pune. Discover our commitment to exceptional hospitality and luxury accommodation."
        canonical="/about"
      />

      <section className="relative h-[50vh] sm:h-[60vh] md:h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dnocdufwt/image/upload/v1768633554/DSC01578_nkaah3.jpg"
            alt="About Sunshine Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
            Best Wagholi Accommodation
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            We Are The Best Host For Your Comfort
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/room5_11zon.jpg"
                alt="Luxury Room"
                className="rounded-lg shadow-xl w-full h-auto"
                loading="lazy"
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[#F59E0B] font-semibold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 tracking-wider uppercase">ABOUT Hotel Supreme Stay Wagholi</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
                Pune Stay Specialists
              </h2>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Welcome to Hotel Supreme Stay, your premier destination for luxury accommodation in Wagholi, Pune. We pride ourselves on delivering exceptional hospitality, modern amenities, and unforgettable experiences to every guest who walks through our doors.
              </p>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Since our establishment, we have been committed to providing world-class service that combines traditional Indian warmth with contemporary luxury. Our dedicated team works tirelessly to ensure your stay is comfortable, memorable, and exceeds your expectations.
              </p>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">
                Whether you're visiting for business or leisure, Hotel Supreme Stay offers the perfect blend of sophistication and comfort in the heart of Pune's growing Wagholi area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Premium Amenities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280]">
              Experience comfort and convenience at every turn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Wifi, name: 'Free Wi-Fi', description: 'High-speed internet throughout the property' },
              { icon: Clock, name: '24/7 Front Desk', description: 'Round-the-clock service for your convenience' },
              { icon: Bell, name: 'Room Service', description: 'Dedicated room service within your rooms' },
              { icon: UtensilsCrossed, name: 'Restaurant', description: 'Fine dining with local and international cuisine' },
              { icon: Car, name: 'Free Parking', description: 'Secure parking for all guests' },
              { icon: BedDouble, name: 'Spacious Rooms', description: 'Generously spacious rooms for ultimate comfort' }
            ].map((amenity, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                  <amenity.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">{amenity.name}</h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-[#111827] mb-2">10+</p>
              <p className="text-lg sm:text-xl text-[#6B7280]">Rooms</p>
            </div>

            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-[#111827] mb-2">5+</p>
              <p className="text-lg sm:text-xl text-[#6B7280]">Years of Experience</p>
            </div>

            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-[#111827] mb-2">4.8</p>
              <p className="text-lg sm:text-xl text-[#6B7280]">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
