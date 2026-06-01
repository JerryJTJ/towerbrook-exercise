import { GoogleGenAI } from "@google/genai";
import { tavilyThemeSearch } from "../tools/tavily.js";
import { scraperSchema } from "../interfaces/gemini.schema.js";
import { handleInsertPerson, insertCompanies } from "../tools/supabase.tool.js";
import { supabase } from "../index.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function runScraperAgent(themeId: number) {
	const theme = await supabase
		.from("theme")
		.select("name")
		.eq("id", Number(themeId))
		.single();

	if (theme.error || !theme.data) {
		throw new Error(theme.error.message);
	}

	// Scrape
	const data = await tavilyThemeSearch(theme.data.name);

	try {
		const result = await ai.models.generateContent({
			model: "gemini-3.1-flash-lite",
			contents: `Clean this data and remove any duplicate companies and people: ${JSON.stringify(data)}`,
			config: {
				responseMimeType: "application/json",
				responseJsonSchema: scraperSchema,
			},
		});

		if (!result?.text) {
			throw new Error("Gemini returned no text output");
		}

		let structuredData;
		try {
			structuredData = JSON.parse(result.text);
		} catch (parseError) {
			const message =
				parseError instanceof Error
					? parseError.message
					: String(parseError);
			console.error("Failed to parse Gemini response text:", result.text);
			throw new Error(
				`Failed to parse Gemini response as JSON: ${message}`,
			);
		}

		await insertCompanies(
			structuredData.companies.map(
				(company: { name: string; category: string }) => ({
					...company,
					theme_id: themeId,
				}),
			),
		);

		await Promise.all(
			structuredData.people.map(
				async (person: {
					name: string;
					company: string;
					role: string;
				}) => {
					await handleInsertPerson({
						...person,
						theme_id: themeId,
					});
				},
			),
		);
	} catch (error) {
		console.error("runScraperAgent error:", error);
		throw new Error(
			`Scraper agent failed: ${(error as Error).message ?? "unknown error"}`,
		);
	}
}
