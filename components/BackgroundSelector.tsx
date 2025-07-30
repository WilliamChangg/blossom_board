'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Upload, X, Palette } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

const cherryBlossomColors = [
  {
    id: 'sakura-pink',
    name: 'Sakura Pink',
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
    description: 'Soft cherry blossom pink'
  },
  {
    id: 'spring-dawn',
    name: 'Spring Dawn',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #f3e8ff 70%, #e0e7ff 100%)',
    description: 'Gentle spring morning'
  },
  {
    id: 'petal-breeze',
    name: 'Petal Breeze',
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 25%, #fecaca 50%, #f9a8d4 75%, #f0abfc 100%)',
    description: 'Dancing cherry petals'
  }
];

const natureBackgrounds = [
  {
    id: 'forest',
    name: 'Peaceful Forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    description: 'Misty forest path'
  },
  {
    id: 'mountains',
    name: 'Mountain Lake',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    description: 'Serene mountain lake'
  },
  {
    id: 'blossom',
    name: 'Cherry Blossoms',
    url: '/cherry_blossom.png',
    description: 'Beautiful cherry blossoms'
  },
  {
    id: 'meadow',
    name: 'Flower Meadow',
    url: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    description: 'Colorful wildflower field'
  },
  {
    id: 'bamboo',
    name: 'Bamboo Grove',
    url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    description: 'Zen bamboo forest'
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    description: 'Warm golden hour'
  }
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onBackgroundChange(result);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Background Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 hover:bg-white transition-all duration-200 group"
        title="Change Background"
      >
        <Palette size={20} className="text-slate-600 group-hover:text-slate-800" />
      </button>

      {/* Background Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Choose Background</h3>
                  <p className="text-slate-600">Select a serene nature scene for your workspace</p>
                </div>
                <button
                  title="select"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Custom Upload Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <Upload size={20} className="text-blue-600" />
                  <h4 className="font-semibold text-slate-800">Upload Custom Image</h4>
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400 transition-colors">
                    <Image size={32} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-slate-600">Click to upload your own background image</p>
                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP</p>
                  </div>
                </label>
              </div>

              {/* Cherry Blossom Colors Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></div>
                  <h4 className="font-semibold text-slate-800">Cherry Blossom Palette</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {cherryBlossomColors.map((color) => (
                    <motion.button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        onBackgroundChange(color.gradient);
                        setIsOpen(false);
                      }}
                      className={`relative group overflow-hidden rounded-xl aspect-video border-2 transition-all duration-200 ${
                        currentBackground === color.gradient 
                          ? 'border-pink-500 ring-2 ring-pink-200' 
                          : 'border-white/30 hover:border-pink-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="w-full h-full"
                        style={{ background: color.gradient }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <h5 className="font-semibold text-sm">{color.name}</h5>
                        <p className="text-xs opacity-90">{color.description}</p>
                      </div>
                      {currentBackground === color.gradient && (
                        <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Nature Backgrounds Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <h4 className="font-semibold text-slate-800">Nature Backgrounds</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {natureBackgrounds.map((bg) => (
                    <motion.button
                      key={bg.id}
                      type="button"
                      onClick={() => {
                        onBackgroundChange(bg.url);
                        setIsOpen(false);
                      }}
                      className={`relative group overflow-hidden rounded-xl aspect-video border-2 transition-all duration-200 ${
                        currentBackground === bg.url 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={bg.url}
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <h5 className="font-semibold text-sm">{bg.name}</h5>
                        <p className="text-xs opacity-90">{bg.description}</p>
                      </div>
                      {currentBackground === bg.url && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};