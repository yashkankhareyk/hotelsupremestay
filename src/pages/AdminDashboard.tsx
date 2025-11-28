import { fetchCsrfToken } from "../api/client";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, LogOut, Image, Home, Upload } from 'lucide-react';
import SEO from '../components/SEO';
import { AdminState, ImageFormData } from '../types/admin';
import { AdminAPI } from '../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    username: null
  });
  const [activeTab, setActiveTab] = useState<'gallery' | 'home'>('gallery');
  const [images, setImages] = useState<any[]>([]);
  const [homeImages, setHomeImages] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ImageFormData>({
    url: '',
    alt: '',
    section: 'hero',
    description: '',
    rating: 4.8,
    bookingUrl: 'https://www.booking.com',
    name: '',
    comment: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth) as AdminState;
      if (parsedAuth.isAuthenticated) {
        setAdminState(parsedAuth);
        // Load data
        fetchImages();
      } else {
        navigate('/admin');
      }
    } else {
      navigate('/admin');
    }
  }, [navigate]);

  // Fetch images based on active tab
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'gallery') {
        const data = await AdminAPI.gallery.list();
        setImages(data);
      } else {
        const data = await AdminAPI.home.list();
        setHomeImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch images when tab changes
  useEffect(() => {
    fetchImages();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const handleAddImage = () => {
    setEditingImage(null);
    setFormData({
      url: '',
      alt: '',
      section: activeTab === 'home' ? 'hero' : 'hero',
      description: '',
      rating: 4.8,
      bookingUrl: 'https://www.booking.com',
      name: '',
      comment: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const handleEditImage = (id: string) => {
    const currentImages = activeTab === 'gallery' ? images : homeImages;
    const imageToEdit = currentImages.find(img => img._id === id);
    if (imageToEdit) {
      setEditingImage(id);
      setFormData({
        url: imageToEdit.url || '',
        alt: imageToEdit.alt || '',
        section: imageToEdit.section || 'hero',
        description: imageToEdit.meta?.description || '',
        rating: imageToEdit.meta?.rating || 4.8,
        bookingUrl: imageToEdit.meta?.bookingUrl || 'https://www.booking.com',
        name: imageToEdit.meta?.name || '',
        comment: imageToEdit.meta?.comment || ''
      });
      setSelectedFile(null);
      setPreviewUrl(imageToEdit.url || null);
      setShowForm(true);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setIsLoading(true);
      try {
        await fetchCsrfToken();

        if (activeTab === 'gallery') {
          await AdminAPI.gallery.remove(id);
        } else {
          await AdminAPI.home.remove(id);
        }
        // Refresh images after deletion
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) || 4.8 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await fetchCsrfToken();
      let payload;
      
      // If we have a file, create FormData
      if (selectedFile) {
        const formDataObj = new FormData();
        formDataObj.append('image', selectedFile);
        formDataObj.append('alt', formData.alt);
        
        if (activeTab === 'home') {
          // Always append section for home images
          formDataObj.append('section', formData.section || 'hero');
          
          // Add additional metadata for property images
          if (formData.section === 'property') {
            formDataObj.append('description', formData.description || '');
            formDataObj.append('rating', String(formData.rating || 4.8));
            formDataObj.append('bookingUrl', formData.bookingUrl || 'https://www.booking.com');
          }
          
          // Add additional metadata for testimonial images
          if (formData.section === 'testimonial') {
            formDataObj.append('name', formData.name || '');
            formDataObj.append('rating', String(formData.rating || 4.8));
            formDataObj.append('comment', formData.comment || '');
          }
        }
        payload = formDataObj;
      } else {
        // Otherwise use the URL
        payload = {
          url: formData.url,
          alt: formData.alt,
          ...(activeTab === 'home' ? { 
            section: formData.section || 'hero',
            ...(formData.section === 'property' ? { 
              meta: {
                description: formData.description || '',
                rating: formData.rating || 4.8,
                bookingUrl: formData.bookingUrl || 'https://www.booking.com'
              } 
            } : formData.section === 'testimonial' ? {
              meta: {
                name: formData.name || '',
                rating: formData.rating || 4.8,
                comment: formData.comment || ''
              }
            } : {})
          } : {})
        };
      }

      await fetchCsrfToken();
      if (editingImage) {
        // Update existing image
        if (activeTab === 'gallery') {
          await AdminAPI.gallery.update(editingImage, payload);
        } else {
          await AdminAPI.home.update(editingImage, payload);
        }
      } else {
        // Create new image
        if (activeTab === 'gallery') {
          await AdminAPI.gallery.create(payload);
        } else {
          await AdminAPI.home.create(payload);
        }
      }
      
      // Reset form and refresh images
      setShowForm(false);
      setEditingImage(null);
      setFormData({ 
        url: '', 
        alt: '', 
        section: 'hero',
        description: '',
        rating: 4.8,
        bookingUrl: 'https://www.booking.com',
        name: '',
        comment: ''
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      // Show more detailed error message from server
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Unknown error occurred. Please check the server logs.';
      alert(`Failed to save image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Dashboard"
        description="Admin dashboard for Sunshine Hotel"
        canonical="/admin/dashboard"
      />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <header className="bg-[#0B132B] text-white py-3 sm:py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <span className="text-sm sm:text-base">Welcome, {adminState.username}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap ${activeTab === 'gallery' ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('gallery')}
            >
              <Image size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Gallery Images</span>
              <span className="sm:hidden">Gallery</span>
            </button>
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap ${activeTab === 'home' ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Home Page Images</span>
              <span className="sm:hidden">Home</span>
            </button>
          </div>

          {/* Add Image Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={handleAddImage}
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-white px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              disabled={isLoading}
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              Add New Image
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F59E0B]"></div>
            </div>
          )}

          {/* Image Form */}
          {showForm && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Choose File
                    </button>
                    <span className="text-xs sm:text-sm text-gray-500 break-all">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {previewUrl && (
                    <div className="mt-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="h-32 sm:h-40 object-contain rounded-md border border-gray-300 w-full" 
                      />
                    </div>
                  )}
                </div>

                {/* OR Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">OR</span>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={formData.url || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                  />
                </div>

                {/* Alt Text */}
                <div>
                  <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="alt"
                    name="alt"
                    value={formData.alt || ''}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                    placeholder="Image description"
                  />
                </div>

                {/* Section (for home images) */}
                {activeTab === 'home' && (
                  <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section || 'hero'}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                    >
                      <option value="hero">Hero Section</option>
                      <option value="property">Property Section</option>
                      <option value="testimonial">Testimonial Section</option>
                    </select>
                  </div>
                )}

                {/* Additional fields for property section */}
                {activeTab === 'home' && formData.section === 'property' && (
                  <div className="space-y-4 sm:space-y-5 border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Property Details</h3>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                        placeholder="Luxury accommodation with premium amenities"
                      />
                    </div>
                    
                    {/* Rating */}
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating || 4.8}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                      />
                    </div>
                    
                    {/* Booking URL */}
                    <div>
                      <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Booking URL
                      </label>
                      <input
                        type="url"
                        id="bookingUrl"
                        name="bookingUrl"
                        value={formData.bookingUrl || ''}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                        placeholder="https://www.booking.com"
                      />
                    </div>
                  </div>
                )}

                {/* Additional fields for testimonial section */}
                {activeTab === 'home' && formData.section === 'testimonial' && (
                  <div className="space-y-4 sm:space-y-5 border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Testimonial Details</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      The uploaded image will be used as the profile picture (avatar) for this testimonial.
                    </p>
                    
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    {/* Rating */}
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating || 4.8}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] text-sm sm:text-base"
                      />
                    </div>
                    
                    {/* Comment */}
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Comment <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment || ''}
                        onChange={handleFormChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F59E0B] focus:border-[#F59E0B] resize-none text-sm sm:text-base"
                        placeholder="Great service and beautiful rooms..."
                      />
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-4 py-2.5 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {editingImage ? 'Update Image' : 'Add Image'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingImage(null);
                      setFormData({
                        url: '',
                        alt: '',
                        section: 'hero',
                        description: '',
                        rating: 4.8,
                        bookingUrl: 'https://www.booking.com',
                        name: '',
                        comment: ''
                      });
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(activeTab === 'gallery' ? images : homeImages).map((image) => (
              <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="relative h-40 sm:h-48">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {activeTab === 'home' && (
                    <div className="absolute top-2 left-2 bg-[#0B132B] text-white text-xs px-2 py-1 rounded-md">
                      {image.section}
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <p className="text-gray-700 mb-2 font-medium text-sm sm:text-base line-clamp-2">{image.alt}</p>
                  {image.section === 'testimonial' && image.meta?.name && (
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{image.meta.name}</p>
                  )}
                  {image.meta?.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{image.meta.description}</p>
                  )}
                  {image.section === 'testimonial' && image.meta?.comment && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 italic line-clamp-2">"{image.meta.comment}"</p>
                  )}
                  {image.meta?.rating && (
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      <span className="text-yellow-500 text-sm sm:text-base">⭐</span>
                      <span className="text-xs sm:text-sm font-medium">{image.meta.rating}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 mt-auto pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleEditImage(image._id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs sm:text-sm px-2 py-1"
                      disabled={isLoading}
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors text-xs sm:text-sm px-2 py-1"
                      disabled={isLoading}
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && (activeTab === 'gallery' ? images.length === 0 : homeImages.length === 0) && (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm px-4">
              <Image size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No images found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Get started by adding your first image.
              </p>
              <button
                onClick={handleAddImage}
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                Add New Image
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
