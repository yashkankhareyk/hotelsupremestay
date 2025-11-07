export interface Property {
  id: string | number;
  title: string;
  description: string;
  rating: number;
  image: string;
  bookingUrl: string;
}

export interface Amenity {
  icon: string;
  name: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Add or update these types
export interface GalleryImage {
  _id?: string;
  url: string;
  publicId?: string;
  alt: string;
  order?: number;
  meta?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeImage {
  _id?: string;
  url: string;
  publicId?: string;
  alt: string;
  section: 'hero' | 'property' | 'testimonial';
  order?: number;
  meta?: any;
  createdAt?: string;
  updatedAt?: string;
}
