import Scan from '../models/scan.model.js';

export const saveScan = async (req, res) => {
    try {
        const { plantName, diseaseName, confidence, imageUrl, diseaseInfo } = req.body;
        
        const scan = new Scan({
            userId: req.user._id,
            plantName,
            diseaseName,
            confidence,
            imageUrl,
            diseaseInfo
        });

        await scan.save();
        res.status(201).json(scan);
    } catch (error) {
        console.error('Error saving scan:', error);
        res.status(500).json({ message: 'Error saving scan' });
    }
};

export const getRecentScans = async (req, res) => {
    try {
        const scans = await Scan.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(scans);
    } catch (error) {
        console.error('Error fetching recent scans:', error);
        res.status(500).json({ message: 'Error fetching recent scans' });
    }
};

export const getScanDetails = async (req, res) => {
    try {
        const scan = await Scan.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!scan) {
            return res.status(404).json({ message: 'Scan not found' });
        }

        res.json(scan);
    } catch (error) {
        console.error('Error fetching scan details:', error);
        res.status(500).json({ message: 'Error fetching scan details' });
    }
}; 