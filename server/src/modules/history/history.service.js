import Job from '../../models/job.model.js';
import Lead from '../../models/leads.model.js';

export const getJobsByUser = async (userId) => {
    return await Job.find({ userId }).sort({ createdAt: -1 });
};

export const deleteJobById = async (jobId, userId) => {
    const job = await Job.findOneAndDelete({ jobId, userId });
    if (!job) throw new Error('Job not found or unauthorized');
    await Lead.deleteMany({ jobId });
    return { deleted: true };
};