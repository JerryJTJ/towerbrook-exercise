import {
	tavily,
	type TavilyResearchResponse,
	type TavilyGetResearchResponse,
} from "@tavily/core";
import {
	researcherSchema,
	scraperSchema,
} from "../interfaces/tavily.schema.js";

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

export async function tavilySearch(query: string) {
	const resp = await tavilyClient.search(query, {
		maxResults: 50,
		searchDepth: "advanced",
	});

	return resp.results.map((result) => ({
		content: result.content,
		title: result.title,
		url: result.url,
	}));
}

export async function tavilyResearch(query: string, schema?: any) {
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const response = (await tavilyClient.research(query, {
		model: "mini",
		stream: false,
		output_schema: schema,
	})) as TavilyResearchResponse;

	const requestId = response.requestId;

	const MAX_WAIT_MS = 90000;
	const START = Date.now();

	while (true) {
		const research = await tavilyClient.getResearch(requestId);

		if (research.status === "completed") {
			return (research as TavilyGetResearchResponse).content;
		}

		if (research.status != "in_progress") {
			throw new Error(`Failed to research`);
		}

		if (Date.now() - START > MAX_WAIT_MS) {
			throw new Error("Tavily research timed out");
		}

		await sleep(1000);
	}
}

export async function tavilyThemeSearch(theme: string) {
	const prompt = `You are an expert private equity research analyst in ${theme}.

TASK:
- Find relevant experts (founders, execs, investors, bankers, lawyers, advisors).
- Identify related companies (startups, funds, advisory firms).

OUTPUT (STRICT JSON ONLY):
{
  "people": [
    {"name": "", "company": "", "role": ""}
  ],
  "companies": [
    {"name": "", "category": "product | fund | advisory | services | other"}
  ]
}

RULES:
- No text outside JSON
- No duplicates
- Only real, relevant entities
- Company names should be clean (no LLC, no Inc.)
- Roles should be 3 words or less (e.g. CTO, Founder)`;

	return await tavilyResearch(prompt, scraperSchema);
}

export async function tavilyCompanyResearch(company: string) {
	const prompt = `You are an expert private equity research analyst. Research ${company} and provide the following information:

1. Description
   - A concise summary of what the company does, its products/services, target customers, and industry.

2. Revenue
   - Most recent annual revenue available.
   - Include the amount in USD and source.
   - If unavailable, state "Not publicly available".

3. EBITDA
   - Most recent annual EBITDA available.
   - Include the amount in USD and source.
   - If unavailable, make a prediction based on available data and comparable companies, and clearly label it as an estimate.

4. Equity
   - Most recent reported shareholders' equity, book equity, or equity value available.
   - Include the amount in USD and source.
   - If unavailable, make a prediction based on available data and comparable companies, and clearly label it as an estimate.

Requirements:
- Prioritize official company filings, annual reports, investor presentations, and reputable financial databases.
- Use the most recent information available.
- Normalize monetary values exactly as reported and include the currency.
- Do not estimate or infer financial figures.
- If multiple figures are found, use the latest audited or officially reported value.
- Return information matching the provided schema.`;

	return await tavilyResearch(prompt, researcherSchema);
}
