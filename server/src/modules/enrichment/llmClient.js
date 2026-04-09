const MODELS = [
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    'google/gemma-3-12b-it:free',
    'deepseek/deepseek-r1-0528-qwen3-8b:free',
    'qwen/qwen3-8b:free',
    'microsoft/phi-4-reasoning-plus:free',
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const callLLM = async (prompt) => {
    for (const model of MODELS) {
        for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`   🔁 Trying model: ${model} (attempt ${attempt})`);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0.3
            })
            });

            const data = await response.json();

            // No endpoints for this model — skip immediately, don't retry
            if (data.error?.message?.includes('No endpoints found')) {
            console.log(`${model} has no endpoints, skipping...`);
            break;
            }

            // Rate limited — wait longer and retry
            if (data.error?.code === 429) {
            const waitSeconds = attempt * 15; // 15s, 30s, 45s
            console.log(` Rate limited on ${model}, waiting ${waitSeconds}s...`);
            await delay(waitSeconds * 1000);
            continue;
            }

            // Other error — try next model
            if (!response.ok || data.error) {
            console.log(` ${model} failed: ${data.error?.message}`);
            break;
            }

            const text = data.choices[0]?.message?.content;
            if (text) {
            console.log(`Got response from ${model}`);
            return text;
            }

        } catch (err) {
            console.log(`Fetch error: ${err.message}`);
            await delay(2000);
        }
        }
    }

    console.log(` All models exhausted`);
    return null;
};