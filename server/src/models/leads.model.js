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
    status: {
        type: String,
        enum: ["pending", "processed"],
        default: "processed"
    }
},{timestamps:true});

export default mongoose.model("Lead",leadsSchema);