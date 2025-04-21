import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import useCropStore from '../store/useCropStore';
import { 
  Search, Info, Sun, Droplets, Leaf, Bug, Package, 
  Calendar, Thermometer, Droplet, Flower2, Shield, Clock,
  ChevronDown, Sparkles, Wheat, Sprout
} from 'lucide-react';

const CropKnowledgePage = () => {
  const { authUser } = useAuthStore();
  const { 
    availableCrops, 
    selectedCrop, 
    isLoading, 
    error,
    fetchAvailableCrops,
    fetchCropDetails,
    clearSelectedCrop
  } = useCropStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      fetchAvailableCrops();
    }
    return () => {
      clearSelectedCrop();
    };
  }, [authUser, fetchAvailableCrops, clearSelectedCrop]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cropName = searchQuery.trim();
    if (cropName) {
      setIsSearching(true);
      try {
        await fetchCropDetails(cropName);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleCropSelect = (cropName) => {
    setSearchQuery(cropName);
    fetchCropDetails(cropName);
    setIsDropdownOpen(false);
  };

  if (!authUser) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          <p className="text-gray-600">Loading crop information...</p>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Plant Selection': <Flower2 className="text-green-600" size={20} />,
      'Site Selection': <Sun className="text-yellow-600" size={20} />,
      'Field Preparation': <Leaf className="text-green-600" size={20} />,
      'Planting Method': <Calendar className="text-blue-600" size={20} />,
      'Irrigation Schedule': <Droplet className="text-blue-600" size={20} />,
      'Fertilization': <Leaf className="text-green-600" size={20} />,
      'Weeding': <Leaf className="text-green-600" size={20} />,
      'Pest Management': <Bug className="text-red-600" size={20} />,
      'Harvesting': <Wheat className="text-orange-600" size={20} />,
      'Post Harvesting': <Package className="text-gray-600" size={20} />
    };
    return icons[category] || <Info className="text-gray-600" size={20} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Crop Knowledge Base
          </h1>
          <p className="text-gray-600 text-lg">
            Discover comprehensive farming guides and tips for various crops
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-12">
          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a crop..."
                className="w-full px-6 py-4 pr-24 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </form>
          </div>

          {/* Available Crops Section */}
          <div className="w-full max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Available Crops</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCrops.map((crop) => (
                <button
                  key={crop.name}
                  onClick={() => handleCropSelect(crop.name)}
                  className={`p-4 rounded-xl flex items-center gap-4 transition-all border-2 ${
                    searchQuery === crop.name 
                      ? 'bg-green-50 border-green-500 shadow-md' 
                      : 'border-gray-100 hover:border-green-500 hover:shadow-md'
                  }`}
                >
                  <span className="text-4xl bg-gray-50 p-3 rounded-xl">
                    {crop.icon}
                  </span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {crop.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Shield size={20} />
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Crop Information Display */}
        {selectedCrop && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Crop Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
              <div className="flex items-center gap-6">
                <span className="text-6xl bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  {selectedCrop.icon}
                </span>
                <div>
                  <h2 className="text-3xl font-bold">{searchQuery}</h2>
                  <p className="text-green-50 mt-2">{selectedCrop.description}</p>
                </div>
              </div>
            </div>

            {/* Crop Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              {Object.entries(selectedCrop).map(([category, content]) => {
                if (category === 'icon' || category === 'description') return null;
                return (
                  <div 
                    key={category}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getCategoryIcon(category)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-600">{content.description}</p>
                      
                      {content.recommended && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Recommended Varieties</h4>
                          <div className="flex flex-wrap gap-2">
                            {content.recommended.map((variety) => (
                              <span 
                                key={variety}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                              >
                                {variety}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.requirements && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                          <ul className="space-y-2">
                            {content.requirements.map((req) => (
                              <li key={req} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span className="text-gray-600">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {content.steps && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Steps</h4>
                          <ol className="space-y-2">
                            {content.steps.map((step, index) => (
                              <li key={step} className="flex items-start gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                  {index + 1}
                                </span>
                                <span className="text-gray-600 flex-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {content.tips && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                            <Info size={18} />
                            Pro Tips
                          </h4>
                          <p className="text-amber-700">{content.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchQuery && !selectedCrop && !error && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700">
                <Info size={20} />
                <p>No information found for "{searchQuery}". Please try another crop.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropKnowledgePage; 