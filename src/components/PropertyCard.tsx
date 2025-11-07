import { Star, ExternalLink } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl h-full flex flex-col">
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#F59E0B] text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          <span className="font-semibold text-sm sm:text-base">{property.rating}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2 sm:mb-3 leading-tight">{property.title}</h3>
        <p className="text-[#6B7280] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-1">{property.description}</p>

        {property.bookingUrl && (
          <a
            href={property.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Book Now
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
