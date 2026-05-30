import {
	tavily,
	type TavilyResearchResponse,
	type TavilyGetResearchResponse,
} from "@tavily/core";

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
- Roles should be 3 words or less (e.g. CTO, Founder)`;

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const response = (await tavilyClient.research(prompt, {
		model: "mini",
		stream: false,
	})) as TavilyResearchResponse;

	console.log(response);

	const requestId = response.requestId;

	console.log(requestId);

	const MAX_WAIT_MS = 90000;
	const START = Date.now();

	while (true) {
		const research = await tavilyClient.getResearch(requestId);

		if (research.status === "completed") {
			return (research as TavilyGetResearchResponse).content;
		}

		if (research.status != "in_progress") {
			throw new Error(`Failed to research ${theme}`);
		}

		if (Date.now() - START > MAX_WAIT_MS) {
			throw new Error("Tavily research timed out");
		}

		await sleep(1000);
	}
}

export async function tavilyCompanyResearch(company: string) {
	const prompt = `Research the company ${company} and it's 2026 outlook. Provide a brief overview of the company, its products, services, and market position.`;
	const stream = await tavilyClient.research(prompt, {
		model: "mini",
		stream: false,
	});

	for await (const chunk of stream as AsyncGenerator<Buffer, void, unknown>) {
		console.log(chunk.toString("utf-8"));
	}

	return stream;
}
