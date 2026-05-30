import { GoogleGenAI } from "@google/genai";
import { tavilyThemeSearch } from "../tools/tavily.js";
import { scraperSchema } from "../interfaces/gemini.interface.js";
import { handleInsertPerson, insertCompanies } from "../tools/supabase.tool.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function runScraperAgent(theme: string) {
	// Scrape
	const data = await tavilyThemeSearch(theme);

	const result = await ai.models.generateContent({
		model: "gemini-3.1-flash-lite",
		contents: `Clean this data and remove any duplicate companies and people: ${JSON.stringify(data)}`,
		config: {
			responseMimeType: "application/json",
			responseSchema: scraperSchema,
		},
	});

	const structuredData = JSON.parse(result.text || "{}");

	await insertCompanies(
		structuredData.companies.map(
			(company: { name: string; category: string }) => ({
				...company,
				theme_id: 1,
			}),
		),
	);

	await Promise.all(
		structuredData.people.map(
			async (person: { name: string; company: string; role: string }) => {
				await handleInsertPerson({
					...person,
					theme_id: 1,
				});
			},
		),
	);
}
