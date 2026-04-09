import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    query: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    totalLeads: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'failed'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);