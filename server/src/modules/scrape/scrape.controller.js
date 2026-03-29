import { enqueueScrapeJob,getJobStatus,getLeadsByJobId } from "./scrape.service.js";
import {deductCredits} from '../../modules/credit/credit.service.js';

export const startScrape = async (req,res,next)=>{
    try{
        const { query, limit } = req.body;
        const userId = req.user.user_id;

        if (!query || !limit) {
            return res.status(400).json({ message: "Query and limit required" });
        }

        // Deduct credits BEFORE job
        await deductCredits(userId, limit);

        // Add job to queue
        const jobId = await enqueueScrapeJob({ query, limit, userId });

        res.status(200).json({
            success: true,
            jobId
        });
    }catch(err){
        next(err);
    }
}

export const checkStatus = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const result = await getJobStatus(jobId);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

export const getLeads = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const leads = await getLeadsByJobId(jobId);

        res.json({
            success: true,
            leads
        });
    } catch (error) {
        next(error);
    }
};