import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { axiosInstance, mlAxiosInstance } from '../lib/axios';

const plantDiseaseData = {
  Apple: { diseases: ["Apple Scab", "Apple Black Rot", "Apple Cedar/Apple Rust"] },
  Cherry: { diseases: ["Cherry Powdery Mildew"] },
  Corn: { diseases: ["Corn Cercospora Leaf Spot", "Corn Common Rust", "Corn Northern Leaf Blight"] },
  Grape: { diseases: ["Grape Black Rot", "Grape Esca (Black Measles)", "Grape Leaf Blight"] },
  Orange: { diseases: ["Orange Haunglongbing (Citrus Greening)"] },
  Peach: { diseases: ["Peach Bacterial Spot"] },
  "Pepper Bell": { diseases: ["Pepper Bell Bacterial Spot"] },
  Potato: { diseases: ["Potato Early Blight", "Potato Late Blight"] },
  Squash: { diseases: ["Squash Powdery Mildew"] },
  Strawberry: { diseases: ["Strawberry Leaf Scorch"] },
  Tomato: {
    diseases: [
      "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight",
      "Tomato Leaf Mold", "Tomato Septoria Leaf Spot", "Tomato Spider Mites",
      "Tomato Target Spot", "Tomato Mosaic Virus"
    ]
  }
};

const DetectorPage = () => {
  const { authUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [predictionMethod, setPredictionMethod] = useState('image');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) return toast.error('Login required');
    if (!selectedImage) return toast.error('Upload an image first');

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await mlAxiosInstance.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = response.data;

      if (result.is_healthy) {
        toast.success('Plant is healthy! 🌱');
        setPrediction({ plant_name: result.plant_name, is_healthy: true });
        return;
      }

      setPrediction({
        plant_name: result.plant_name,
        disease: result.disease,
        confidence: result.confidence,
        disease_details: result.disease_details || {
          symptoms: [],
          causes: [],
          treatment: [],
          prevention: []
        }
      });

      toast.warning(`Disease detected: ${result.disease}`);

      await axiosInstance.post('/scan/save', {
        plantName: result.plant_name,
        diseaseName: result.disease,
        confidence: result.confidence,
        diseaseInfo: result.disease_details
      });

    } catch (error) {
      console.error(error);
      toast.error('Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) return toast.error('Login required');
    if (!selectedPlant || !selectedDisease) return toast.error('Select both plant and disease');

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/prediction/disease-info/${selectedDisease}`);
      const result = response.data;

      setPrediction({
        plant_name: selectedPlant,
        disease: selectedDisease,
        is_healthy: false,
        confidence: null,
        disease_details: result.disease_info
      });

    } catch (error) {
      console.error(error);
      toast.error('Error fetching disease info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Plant Disease Detector</h1>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setPredictionMethod('image')}
            className={`px-4 py-2 rounded-md ${predictionMethod === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setPredictionMethod('manual')}
            className={`px-4 py-2 rounded-md ${predictionMethod === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Select Manually
          </button>
        </div>

        <div className="bg-white p-6 shadow rounded-md">
          {predictionMethod === 'image' ? (
            <form onSubmit={handleImageSubmit}>
              <div className="border-2 border-dashed p-4 text-center rounded-md">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-gray-500">Upload image of affected leaf (JPG/PNG)</p>
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer block mt-2 text-blue-500 hover:text-blue-600">
                  Click to upload
                </label>
              </div>

              {previewUrl && (
                <div className="mt-4 relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-md" />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedImage || isLoading}
                className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : null}
                {isLoading ? 'Detecting...' : 'Detect Disease'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualSubmit}>
              <label className="block mb-2 font-medium">Select Plant</label>
              <select className="w-full mb-4 p-2 border" onChange={(e) => setSelectedPlant(e.target.value)}>
                <option value="">-- Choose Plant --</option>
                {Object.keys(plantDiseaseData).map((plant) => (
                  <option key={plant} value={plant}>{plant}</option>
                ))}
              </select>

              {selectedPlant && (
                <>
                  <label className="block mb-2 font-medium">Select Disease</label>
                  <select className="w-full mb-4 p-2 border" onChange={(e) => setSelectedDisease(e.target.value)}>
                    <option value="">-- Choose Disease --</option>
                    {plantDiseaseData[selectedPlant].diseases.map((disease) => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </select>
                </>
              )}

              <button
                type="submit"
                disabled={!selectedPlant || !selectedDisease || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : null}
                {isLoading ? 'Fetching info...' : 'Get Disease Info'}
              </button>
            </form>
          )}
        </div>

        {prediction && (
          <div className="mt-6 bg-white shadow-md p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <p><strong>Plant:</strong> {prediction.plant_name}</p>
            {!prediction.is_healthy && (
              <>
                <p><strong>Disease:</strong> {prediction.disease?.replace(/_/g, ' ')}</p>
                <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
              </>
            )}
            {prediction.is_healthy && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                ✅ Your plant is healthy!
              </div>
            )}

            {!prediction.is_healthy && prediction.disease_details && (
              <div className="mt-6 space-y-4">
                {['symptoms', 'causes', 'treatment', 'prevention'].map((key) => (
                  prediction.disease_details[key]?.length > 0 && (
                    <div key={key}>
                      <h3 className="font-semibold capitalize">{key}</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {prediction.disease_details[key].map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectorPage; 