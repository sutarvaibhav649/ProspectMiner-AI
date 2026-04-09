import { callLLM } from './llmClient.js';

export const enrichLead = async (lead, websiteText) => {
    if (!websiteText) {
        return {
        services: null,
        ownerName: null,
        emailPattern: null,
        score: 'Low',
        scoreReason: 'No website content available'
        };
    }

    const prompt = `
        You are a B2B lead qualification expert. Analyze the following business website content and extract structured information.

        Business Name: ${lead.name}
        Business Category: ${lead.category || 'Unknown'}
        Website Text:
        """
        ${websiteText}
        """

        Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks. Just raw JSON.

        {
        "services": "comma-separated list of key services offered (max 5)",
        "ownerName": "owner or doctor name if mentioned, else null",
        "emailPattern": "guessed email pattern like contact@domain.com or null",
        "score": "High or Medium or Low",
        "scoreReason": "one sentence explaining the score"
        }

        Scoring rules:
        - High: clear services listed, professional site, strong relevance to query
        - Medium: some info available but incomplete or generic site
        - Low: no useful info, under construction, or unrelated content
        `;

    const response = await callLLM(prompt);
    if (!response) {
        return {
        services: null,
        ownerName: null,
        emailPattern: null,
        score: 'Low',
        scoreReason: 'LLM call failed'
        };
    }

    try {
        // Strip any accidental markdown backticks
        const clean = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        return {
            services: parsed.services || null,       // ← must be 'services'
            ownerName: parsed.ownerName || null,      // ← must be 'ownerName'
            emailPattern: parsed.emailPattern || null, // ← must be 'emailPattern'
            score: ['High', 'Medium', 'Low'].includes(parsed.score) ? parsed.score : 'Low',
            scoreReason: parsed.scoreReason || null
        };
    } catch (err) {
        console.log(` Failed to parse LLM response: ${err.message}`);
        console.log(`Raw response: ${response}`);
        return {
        services: null,
        ownerName: null,
        emailPattern: null,
        score: 'Low',
        scoreReason: 'Failed to parse LLM response'
        };
    }
};