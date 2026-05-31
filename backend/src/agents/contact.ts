import { GoogleGenAI } from "@google/genai";
import { companyRepository } from "../db/company.repository.js";
import { peopleRepository } from "../db/people.repository.js";
import { tavilySearch } from "../tools/tavily.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const callPrepSchema = {
	type: "OBJECT",
	properties: {
		backgroundSummary: { type: "STRING" },
		contactDetails: {
			type: "OBJECT",
			properties: {
				email: { type: "STRING" },
				phone: { type: "STRING" },
				linkedin: { type: "STRING" },
				other: { type: "STRING" },
			},
		},
		keyTopics: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					topic: { type: "STRING" },
					rationale: { type: "STRING" },
				},
				required: ["topic", "rationale"],
			},
		},
		suggestedQuestions: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					question: { type: "STRING" },
					intent: { type: "STRING" },
				},
				required: ["question", "intent"],
			},
		},
		redFlags: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					flag: { type: "STRING" },
					detail: { type: "STRING" },
				},
				required: ["flag", "detail"],
			},
		},
		recommendedFollowUps: {
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
		"backgroundSummary",
		"contactDetails",
		"keyTopics",
		"suggestedQuestions",
		"redFlags",
		"recommendedFollowUps",
	],
};

export interface CallPrepOutput {
	backgroundSummary: string;
	contactDetails: {
		email: string;
		phone: string;
		linkedin: string;
		other: string;
	};
	keyTopics: { topic: string; rationale: string }[];
	suggestedQuestions: { question: string; intent: string }[];
	redFlags: { flag: string; detail: string }[];
	recommendedFollowUps: { action: string; reason: string }[];
}

export async function runCallPrepAgent(
	personId: number,
): Promise<CallPrepOutput> {
	const personData = (await peopleRepository.getPersonById(personId)) as any;

	const [company, news] = await Promise.all([
		companyRepository.getCompanyById(personData.company.id),
		tavilySearch(
			`${personData.name} ${personData.company.name} ${personData.theme.name} contact email linkedin`,
		),
	]);

	const prompt = `
You are a senior investment analyst at TowerBrook, a private equity firm.
You are preparing a call brief for an investment professional who is about to speak with an expert contact.

## Person
- Name: ${personData.name}
- Role: ${personData.role}
- Theme: ${personData.theme.name}

## Their Company
- Name: ${company.name}
- Category: ${company.category}
- Description: ${company.description ?? "Not available"}
- Website: ${company.website ?? "Not listed"}
- Financials: ${JSON.stringify(company.finances)}

## Recent News & Web Research
${JSON.stringify(news)}

Extract any contact details (email, phone, LinkedIn URL) found in the research above.
If a field is not found, return an empty string for that field.

Produce a concise, actionable call prep brief. Be direct and specific — the reader is time-crunched.
Focus on what is most relevant to TowerBrook's interest in the "${personData.theme.name}" theme.
For red flags, consider: conflicts of interest, recent controversies, competitor relationships, or anything that warrants caution.
For follow-ups, suggest concrete next steps such as intros to make, documents to request, or companies to ask about.
  `.trim();

	const result = await ai.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: callPrepSchema,
		},
	});

	const output = JSON.parse(result.text || "{}") as CallPrepOutput;

	await peopleRepository.updatePersonCallInfo(personId, output);

	return output;
}
