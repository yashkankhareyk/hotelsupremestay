import { GalleryImage } from '.';

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  username: string | null;
}

export interface HomeImage {
  id?: string | number;
  _id?: string;
  url: string;
  publicId?: string;
  alt: string;
  section: 'hero' | 'property' | 'testimonial';
  order?: number;
  meta?: {
    description?: string;
    rating?: number;
    bookingUrl?: string;
    name?: string; // For testimonial section
    comment?: string; // For testimonial section
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type ImageType = GalleryImage | HomeImage;

export interface ImageFormData {
  url: string;
  alt: string;
  section?: 'hero' | 'property' | 'testimonial';
  description?: string;
  rating?: number;
  bookingUrl?: string;
  name?: string; // For testimonial section
  comment?: string; // For testimonial section
}