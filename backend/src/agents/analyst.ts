import { GoogleGenAI } from "@google/genai";
import { companyRepository } from "../db/company.repository.js";
import { tavilySearch, tavilyCompanyResearch } from "../tools/tavily.js";
import { insertCompanyFinancials } from "../tools/supabase.tool.js";
import type { Json } from "../interfaces/supabase.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const companyFitSchema = {
	type: "OBJECT",
	properties: {
		fitScore: { type: "INTEGER" },
		fitSummary: { type: "STRING" },

		strengths: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					point: { type: "STRING" },
					evidence: { type: "STRING" },
				},
				required: ["point", "evidence"],
			},
		},

		concerns: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					risk: { type: "STRING" },
					detail: { type: "STRING" },
				},
				required: ["risk", "detail"],
			},
		},

		keyMetricsInterpretation: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					metric: { type: "STRING" },
					interpretation: { type: "STRING" },
				},
				required: ["metric", "interpretation"],
			},
		},

		towerBrookRelevance: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					theme: { type: "STRING" },
					relevance: { type: "STRING" },
				},
				required: ["theme", "relevance"],
			},
		},

		nextActions: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					action: { type: "STRING" },
					reason: { type: "STRING" },
				},
				required: ["action", "reason"],
			},
		},
	},
	required: [
		"fitScore",
		"fitSummary",
		"strengths",
		"concerns",
		"keyMetricsInterpretation",
		"towerBrookRelevance",
		"nextActions",
	],
};

export interface CompanyFitOutput {
	fitScore: number;
	fitSummary: string;
	strengths: { point: string; evidence: string }[];
	concerns: { risk: string; detail: string }[];
	keyMetricsInterpretation: { metric: string; interpretation: string }[];
	towerBrookRelevance: { theme: string; relevance: string }[];
	nextActions: { action: string; reason: string }[];
}

export async function runAnalystAgent(
	companyId: number,
): Promise<CompanyFitOutput> {
	// Step 1: base company
	const company = await companyRepository.getCompanyById(companyId);

	// Step 2: research (same pattern as analyst agent)
	const [research] = await Promise.all([
		tavilyCompanyResearch(company.name) as Promise<{
			description: string;
			metrics: { metric: string; value: number | null; source: string }[];
		}>,
	]);

	// Step 3: persist enriched description
	if (research?.description) {
		await companyRepository.updateCompanyInfo(companyId, {
			description: research.description,
		});
	}

	// Step 4: persist financials (IMPORTANT ADDITION YOU REQUESTED)
	if (research?.metrics?.length) {
		await companyRepository.replaceCompanyFinancials(
			companyId,
			research.metrics.map((m) => ({
				company_id: companyId,
				metric: m.metric,
				value: m.value,
				source: m.source,
			})),
		);
	}

	// Step 5: re-fetch enriched company (critical for fresh context)
	const enrichedCompany = (await companyRepository.getCompanyById(
		companyId,
	)) as any;

	// Step 6: LLM scoring
	const prompt = `
You are a senior investment analyst at TowerBrook, a private equity firm.

Evaluate how well this company fits TowerBrook's investment strategy.

## Company
- Name: ${enrichedCompany.name}
- Category: ${enrichedCompany.category}
- Website: ${enrichedCompany.website ?? "Not listed"}
- Theme: ${enrichedCompany.theme?.name ?? "Unknown"}
- Description: ${enrichedCompany.description ?? "Not available"}

## Financials
${JSON.stringify(enrichedCompany.finances ?? [])}

---

## TASK

Return:
- fitScore (0–100)
- fitSummary
- strengths
- concerns
- key metric interpretation
- relevance to TowerBrook theme
- next actions

Scoring guidance:
- 80–100: strong PE fit
- 60–79: interesting but conditional
- <60: weak or risky fit

Focus on:
- operational improvement potential
- carve-out / restructuring potential
- market position durability
- cash flow quality
`.trim();

	const result = await ai.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: companyFitSchema,
		},
	});

	const output = JSON.parse(result.text || "{}") as CompanyFitOutput;

	// Step 7: persist final structured result
	await companyRepository.updateCompanyInfo(companyId, {
		score: output.fitScore,
		info: output as unknown as Json,
	});

	return output;
}
