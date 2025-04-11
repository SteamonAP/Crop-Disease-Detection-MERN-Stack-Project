import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import RecentScans from '../components/RecentScans';

const Dashboard = () => {
  const { authUser } = useAuthStore();
  const [scans, setScans] = useState([]);
  const [scanError, setScanError] = useState(null);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch("/api/get-user-scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch scans");
        }
        const data = await response.json();
        setScans(data.scans?.slice(0, 3) || []);
      } catch (error) {
        console.error(error);
        setScanError("Could not load recent scans");
      } finally {
        setLoadingScans(false);
      }
    };

    fetchScans();
  }, []);

  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-crimson-text text-2xl font-bold text-gray-900 md:text-3xl">
            Welcome{authUser?.fullName ? `, ${authUser.fullName}` : ""}! 👋
          </h1>
          <p className="mt-2 text-gray-600">What would you like to do today?</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/detector"
            className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#357AFF]/10 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#357AFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-[#357AFF]">
                Diagnose Crop
              </h2>
            </div>
            <p className="text-gray-600">
              Upload photos to identify crop diseases and get treatment recommendations
            </p>
          </Link>

          <Link
            to="/crops"
            className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 text-[#357AFF]">
              <i className="fas fa-seedling text-3xl"></i>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              Search Crops
            </h2>
            <p className="text-gray-600">
              Browse our crop database for detailed growing information
            </p>
          </Link>

          <Link
            to="/yield"
            className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 text-[#357AFF]">
              <i className="fas fa-chart-line text-3xl"></i>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              Yield Prediction
            </h2>
            <p className="text-gray-600">
              Get AI-powered yield predictions based on your conditions
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Recent Scans
          </h2>
          {loadingScans ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-10 animate-spin" />
            </div>
          ) : scanError ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              {scanError}
            </div>
          ) : scans.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-gray-600">
                No scans yet. Start by diagnosing your first crop!
              </p>
              <Link
                to="/detector"
                className="mt-4 inline-block rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-blue-600"
              >
                Start Scan
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="rounded-lg bg-white p-4 shadow-sm"
                >
                  <img
                    src={scan.image_url}
                    alt="Crop scan result"
                    className="mb-3 h-32 w-full rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-600">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-1 font-semibold">
                    {scan.analysis_results.result}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/detector"
              className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-blue-600"
            >
              New Scan
            </Link>
            <Link
              to="/history"
              className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              View History
            </Link>
            <Link
              to="/settings"
              className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Settings
            </Link>
          </div>
        </div>

        <RecentScans />
      </main>
    </div>
  );
};

export default Dashboard;