import Job from '../../models/job.model.js';
import Lead from '../../models/leads.model.js';

export const getAnalyticsSummary = async (userId) => {

  // 1. All jobs for this user
    const jobs = await Job.find({ userId }).sort({ createdAt: 1 });
    const jobIds = jobs.map(j => j.jobId);

  //2. All leads for this user's jobs
    const leads = await Lead.find({ jobId: { $in: jobIds } });

  //3. Score distribution — total across all jobs
    const scoreDistribution = { High: 0, Medium: 0, Low: 0 };
    leads.forEach(lead => {
        if (lead.score && scoreDistribution[lead.score] !== undefined) {
        scoreDistribution[lead.score]++;
        }
    });

  //  4. Leads scraped over time — one entry per job 
    const leadsOverTime = jobs.map(job => ({
        date: job.createdAt.toISOString().split('T')[0],
        query: job.query,
        totalLeads: job.totalLeads
    }));

  // 5. Top performing queries by High lead %
    const queryMap = {};
    for (const job of jobs) {
        const jobLeads = leads.filter(l => l.jobId === job.jobId);
        const highCount = jobLeads.filter(l => l.score === 'High').length;
        const total = jobLeads.length;

        if (!queryMap[job.query]) {
            queryMap[job.query] = { query: job.query, totalLeads: 0, highLeads: 0 };
        }
            queryMap[job.query].totalLeads += total;
            queryMap[job.query].highLeads += highCount;
    }

    const topQueries = Object.values(queryMap)
            .map(q => ({
            query: q.query,
            totalLeads: q.totalLeads,
            highLeads: q.highLeads,
            highPercentage: q.totalLeads > 0
                ? Math.round((q.highLeads / q.totalLeads) * 100)
                : 0
            }))
            .sort((a, b) => b.highPercentage - a.highPercentage)
            .slice(0, 5);

  // 6. Average rating per query 
    const ratingMap = {};
    for (const lead of leads) {
        const job = jobs.find(j => j.jobId === lead.jobId);
        if (!job || !lead.rating) continue;
        if (!ratingMap[job.query]) ratingMap[job.query] = { total: 0, count: 0 };
        ratingMap[job.query].total += lead.rating;
        ratingMap[job.query].count++;
    }

    const avgRatingPerQuery = Object.entries(ratingMap).map(([query, val]) => ({
        query,
        avgRating: Math.round((val.total / val.count) * 10) / 10
    }));

  // 7. Summary stats 
    const totalJobs = jobs.length;
    const totalLeads = leads.length;
    const totalHighLeads = scoreDistribution.High;
    const overallHighPercentage = totalLeads > 0
        ? Math.round((totalHighLeads / totalLeads) * 100)
        : 0;

    return {
        summary: {
        totalJobs,
        totalLeads,
        totalHighLeads,
        overallHighPercentage
        },
        scoreDistribution,
        leadsOverTime,
        topQueries,
        avgRatingPerQuery
    };
};