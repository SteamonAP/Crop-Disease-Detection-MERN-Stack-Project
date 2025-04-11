import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { Loader, ArrowLeft } from 'lucide-react';

const ScanDetails = () => {
    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScanDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/scan/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setScan(response.data);
            } catch (error) {
                console.error('Error fetching scan details:', error);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchScanDetails();
        }
    }, [token, id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (!scan) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Scan not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-[#357AFF] hover:text-blue-600 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <img 
                        src={scan.imageUrl} 
                        alt={scan.plantName} 
                        className="w-full h-64 object-cover rounded-lg"
                    />
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{scan.plantName}</h1>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <span className="font-medium">Disease:</span> {scan.diseaseName}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Confidence:</span> {scan.confidence}%
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Date:</span> {new Date(scan.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Symptoms</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {scan.diseaseInfo.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Causes</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {scan.diseaseInfo.causes.map((cause, index) => (
                            <li key={index}>{cause}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Treatment</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {scan.diseaseInfo.treatment.map((treatment, index) => (
                            <li key={index}>{treatment}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Prevention</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {scan.diseaseInfo.prevention.map((prevention, index) => (
                            <li key={index}>{prevention}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ScanDetails; 