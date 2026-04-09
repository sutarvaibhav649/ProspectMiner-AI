import mongoose from 'mongoose';

const leadsSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        index: true
    },
    name: String,
    address: String,
    phone: String,
    website: String,
    rating: Number,
    reviewCount: Number,
    category: String,
    services: String,
    ownerName: String,
    emailPattern: String,
    scoreReason: String,
    score: {
        type: String,
        enum: ['High', 'Medium', 'Low', null],
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'processed'],
        default: 'processed'
    }
}, { timestamps: true });

export default mongoose.model('Lead', leadsSchema);