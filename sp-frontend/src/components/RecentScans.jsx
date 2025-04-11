import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { Loader } from 'lucide-react';
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const RecentScans = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentScans = async () => {
            try {
                const response = await axiosInstance.get('/api/scan/recent', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setScans(response.data);
            } catch (error) {
                console.error('Error fetching recent scans:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRecentScans();
        }
    }, [token]);

    const handleScanClick = (scanId) => {
        navigate(`/scan/${scanId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Scans</h2>
            {scans.length === 0 ? (
                <p className="text-gray-600">No recent scans found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scans.map((scan) => (
                        <div 
                            key={scan._id} 
                            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleScanClick(scan._id)}
                        >
                            <img 
                                src={scan.imageUrl} 
                                alt={scan.plantName} 
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg">{scan.plantName}</h3>
                                <p className="text-gray-600">Disease: {scan.diseaseName}</p>
                                <p className="text-gray-600">Confidence: {scan.confidence}%</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(scan.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentScans; 