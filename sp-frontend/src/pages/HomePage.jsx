import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#F7F9F6] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Left Side */}
            <div className="text-center md:w-1/2 md:text-left">
              <h1 className="font-crimson-text text-4xl font-bold text-[#2C5324] md:text-6xl">
                Smart Plant Disease Detection
              </h1>
              <p className="mt-6 text-lg text-[#5B7355]">
                Use AI-powered tools to detect plant diseases, get treatment recommendations, and ensure healthy crops.
              </p>
              <div className="mt-8">
                <Link
                  to="/detector"
                  className="inline-block rounded-lg bg-[#2C5324] px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-[#1F3A19] hover:shadow-lg"
                >
                  Detect Disease Now
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="md:w-1/2">
              <img
                src="/farming-illustration.png"
                alt="Farmer using AI to monitor crops"
                className="w-full max-w-[600px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-crimson-text text-center text-3xl font-bold text-[#2C5324] md:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0E6]">
                <i className="fas fa-camera text-2xl text-[#2C5324]"></i>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#2C5324]">
                Upload Plant Image
              </h3>
              <p className="mt-2 text-[#5B7355]">
                Take or upload a clear photo of your plant's affected area
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0E6]">
                <i className="fas fa-brain text-2xl text-[#2C5324]"></i>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#2C5324]">
                AI Analysis
              </h3>
              <p className="mt-2 text-[#5B7355]">
                Our AI model analyzes the image to identify potential diseases
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0E6]">
                <i className="fas fa-leaf text-2xl text-[#2C5324]"></i>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#2C5324]">
                Get Results
              </h3>
              <p className="mt-2 text-[#5B7355]">
                Receive detailed diagnosis and treatment recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
