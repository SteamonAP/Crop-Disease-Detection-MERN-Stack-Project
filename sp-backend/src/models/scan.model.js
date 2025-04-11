import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plantName: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    diseaseInfo: {
        symptoms: [String],
        causes: [String],
        treatment: [String],
        prevention: [String]
    }
}, {
    timestamps: true
});

export default mongoose.model('Scan', scanSchema); 