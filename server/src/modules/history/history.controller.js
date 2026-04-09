import { getJobsByUser, deleteJobById } from './history.service.js';

export const getHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const jobs = await getJobsByUser(userId);
        res.status(200).json({ success: true, jobs });
    } catch (err) {
        next(err);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { jobId } = req.params;
        const result = await deleteJobById(jobId, userId);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};