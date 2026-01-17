import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { ContactFormData } from '../types';
import { PublicAPI } from '../api/client';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await PublicAPI.contact(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Hotel supreme stay in Wagholi, Pune. Contact us for bookings, inquiries, and more information about our services."
        canonical="/contact"
      />

      <section className="relative h-[50vh] sm:h-[60vh] md:h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dnocdufwt/image/upload/v1768633702/DSC01317_pecfm3.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
                Get In Touch
              </h2>
              <p className="text-base sm:text-lg text-[#6B7280] mb-6 sm:mb-8 leading-relaxed">
                Have questions about our hotel or want to make a special request? Fill out the form and our team will get back to you as soon as possible.
              </p>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#111827] mb-1 text-sm sm:text-base">Address</h3>
                    <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                      Hotel Supreme Stay, Wagholi<br />
                      Pune, Maharashtra 412207<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#111827] mb-1 text-sm sm:text-base">Phone</h3>
                    <a href="tel:+919876543210" className="text-sm sm:text-base text-[#6B7280] hover:text-[#F59E0B] transition-colors break-all">
                      +91 9657100900
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#111827] mb-1 text-sm sm:text-base">Email</h3>
                    <a href="mailto:bookings@hotelsupremestay.in" className="text-sm sm:text-base text-[#6B7280] hover:text-[#F59E0B] transition-colors break-all">
                      bookings@hotelsupremestay.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#111827] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm sm:text-base ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm sm:text-base ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#111827] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm sm:text-base ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#111827] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm sm:text-base ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F59E0B] text-white px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#d97706] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center font-semibold">
                    Thank you! Your message has been sent successfully.
                  </p>
                )}

                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center font-semibold">
                    Sorry, there was an error sending your message. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="w-full">
          {/* Google Map Embed */}
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.90969070346!2d73.9662854752382!3d18.57810978252671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c3006b2ec977%3A0x525552d8cf654687!2sHotel%20Supreme%20Stay!5e0!3m2!1sen!2sin!4v1762548306724!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Supreme Stay Location"
              className="absolute inset-0"
            ></iframe>
          </div>

          {/* Get Directions Button */}
          <div className="bg-white py-4 px-4 sm:px-6 text-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Hotel+Supreme+Stay,+Wagholi,+Pune,+Maharashtra,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
