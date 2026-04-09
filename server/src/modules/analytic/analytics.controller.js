import { getAnalyticsSummary } from './analytics.service.js';

export const getSummary = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const data = await getAnalyticsSummary(userId);
        res.status(200).json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
};